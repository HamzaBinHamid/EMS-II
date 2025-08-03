"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  CardMedia,
  Collapse,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { getImageUrl } from "@/lib/getImageUrl";

// Import course data
import pythonCourse from "@/data/courses/pythonCourse";
import blockchainCourse from "@/data/courses/blockchainCourse";
import webDevCourse from "@/data/courses/webDevCourse";

const courses = [pythonCourse, blockchainCourse, webDevCourse];

export default function ContentSection() {
  const theme = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box component="section" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        mb={4}
        sx={{
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Available Courses
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {courses.map((course, index) => (
          <Grid item xs={12} sm={10} md={6} lg={4} key={index}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 480,
                borderRadius: 3,
                boxShadow: 4,
                overflow: "hidden",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <CardMedia
                component="img"
                image={getImageUrl(course.image)}
                alt={course.title}
                sx={{ height: 180, objectFit: "cover" }}
              />

              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {course.title}
                </Typography>

                <Stack spacing={0.5}>
                  <Typography variant="body2">
                    <strong>Instructor:</strong>{" "}
                    {course.instructorUrl ? (
                      <Link
                        href={course.instructorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: "underline",
                        }}
                      >
                        {course.instructor}
                      </Link>
                    ) : (
                      course.instructor
                    )}
                  </Typography>

                  {course.registrationFee && (
                    <Typography variant="body2">
                      <strong>Registration Fee:</strong>{" "}
                      {course.registrationFee}
                    </Typography>
                  )}
                  {course.tuitionFee && (
                    <Typography variant="body2">
                      <strong>Tuition Fee:</strong> {course.tuitionFee}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    <strong>Timing:</strong> {course.timing}
                  </Typography>
                  {course.startDate && (
                    <Typography variant="body2">
                      <strong>Start Date:</strong> {course.startDate}
                    </Typography>
                  )}
                  {course.duration && (
                    <Typography variant="body2">
                      <strong>Duration:</strong> {course.duration}
                    </Typography>
                  )}

                  {/* Modes (On Campus / Online) */}
                  {Array.isArray(course.mode) &&
                    course.mode.map((m, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "inline-block",
                          my: 0.5,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1.5,
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          backgroundColor:
                            m.type === "Online"
                              ? theme.palette.info.dark
                              : theme.palette.success.dark,
                          color: "#fff",
                          width: "fit-content",
                        }}
                      >
                        {m.type} ({m.days})
                      </Box>
                    ))}
                </Stack>

                {/* Short description */}
                <Typography
                  variant="body2"
                  mt={2}
                  color="text.secondary"
                  sx={{ textAlign: "justify" }}
                >
                  {course.description}
                </Typography>

                {/* Expandable content */}
                <Collapse in={expandedIndex === index}>
                  <Box mt={2}>
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: "pre-line", color: "text.primary" }}
                    >
                      {course.fullDescription}
                    </Typography>
                  </Box>
                </Collapse>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  onClick={() => toggleExpand(index)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  {expandedIndex === index ? "Hide Details" : "More Details"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
