"use client";

import { Box, Typography, Container, Stack } from "@mui/material";

export default function Intro() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 0, // ✅ remove vertical padding
        my: 3, // ✅ remove vertical margin
      }}
    >
      <Container maxWidth="md" sx={{ py: 0 }}>
        <Stack spacing={1.5} textAlign="center">
          <Typography
            variant="h3"
            component="h1"
            sx={(theme) => ({
              fontSize: {
                xs: "1.5rem", // smaller on extra-small screens
                sm: "2rem", // slightly larger on small screens
                md: "3rem", // default for medium+
              },
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              textAlign: "left",
              WebkitTextFillColor: "transparent",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontFamily: theme.typography.fontFamily,
              mt: 1,
              mb: 0.5,
            })}
          >
            Programming with Real-World Courses
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 2,
              mx: "auto",
              maxWidth: "750px",
              textAlign: "justify",
              lineHeight: 1.8,
            }}
          >
            Welcome to our course enrollment platform, your gateway to mastering
            the most in-demand skills in today&apos;s tech-driven world. Whether
            you&apos;re looking to dive into <strong>Python programming</strong>
            , explore the transformative potential of{" "}
            <strong>blockchain technology</strong>, or build a strong foundation
            in <strong>Information Technology (IT)</strong>, we offer expertly
            designed courses to help you achieve your goals. Our hands-on,
            industry-relevant training is perfect for beginners and
            professionals alike, equipping you with the practical knowledge and
            tools needed to thrive in the digital age. Enroll today and take the
            next step in your tech career!
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
