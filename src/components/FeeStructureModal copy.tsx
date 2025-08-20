import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Radio,
  RadioGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { FeeStructure, SubjectWithFee } from "@/types/feeStructure";
import { useTheme } from "@mui/material/styles";

interface FeeStructureModalProps {
  open: boolean;
  onClose: () => void;
  feeStructures: FeeStructure[];
  instituteCategory: string;
}

type StudyMode = "academy" | "online" | "home";

const FeeStructureModal: React.FC<FeeStructureModalProps> = ({
  open,
  onClose,
  feeStructures,
}) => {
  const theme = useTheme();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [allSubjects, setAllSubjects] = useState<SubjectWithFee[]>([]);
  const [studyMode, setStudyMode] = useState<StudyMode>("academy");

  // Collect unique subjects across all fee structures
  useEffect(() => {
    if (open && feeStructures.length > 0) {
      const subjects: SubjectWithFee[] = [];
      feeStructures.forEach((fs) => {
        fs.subjects_with_fee.forEach((s) => {
          if (!subjects.find((sub) => sub.name === s.name)) {
            subjects.push(s);
          }
        });
      });

      // Ensure "All Subjects" is always first
      const allIndex = subjects.findIndex((s) => s.name === "All");
      if (allIndex !== -1) {
        subjects[allIndex].name = "All Subjects"; // rename
        const allSub = subjects.splice(allIndex, 1)[0];
        subjects.unshift(allSub);
      }

      setAllSubjects(subjects);

      // Default select "All Subjects"
      const hasAll = subjects.find((s) => s.name === "All Subjects");
      if (hasAll) {
        setSelectedSubjects(["All Subjects"]);
      } else {
        setSelectedSubjects([]);
      }

      // Default study mode
      setStudyMode("academy");
    }
  }, [open, feeStructures]);

  // Calculate base fee
  const baseFee = (() => {
    if (selectedSubjects.includes("All Subjects")) {
      const allSubject = allSubjects.find((s) => s.name === "All Subjects");
      return allSubject ? allSubject.fee : 0;
    }
    return allSubjects
      .filter((s) => selectedSubjects.includes(s.name))
      .reduce((acc, s) => acc + s.fee, 0);
  })();

  // Apply multiplier based on study mode
  const multiplier: Record<StudyMode, number> = {
    academy: 1,
    online: 2,
    home: 3,
  };
  const totalFee = baseFee * multiplier[studyMode];

  const handleToggleSubject = (name: string) => {
    if (name === "All Subjects") {
      setSelectedSubjects(["All Subjects"]);
      return;
    }

    setSelectedSubjects((prev) => {
      let updated: string[];
      if (prev.includes(name)) {
        updated = prev.filter((sub) => sub !== name);
      } else {
        updated = [...prev.filter((sub) => sub !== "All Subjects"), name];
      }
      return updated;
    });
  };

  const isAllDisabled = selectedSubjects.some((sub) => sub !== "All Subjects");

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="fee-structure-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 450, md: 550 },
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          maxHeight: "85vh",
          overflowY: "auto",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Sticky Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            zIndex: 2,
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Title + Close */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              mb: 1,
            }}
          >
            <Typography
              id="fee-structure-modal-title"
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.2rem", sm: "1.4rem" },
                color: theme.palette.text.primary,
              }}
            >
              Fee Calculator
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 0,
                color: theme.palette.text.secondary,
                "&:hover": { color: theme.palette.primary.main },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Total Fee Bar */}
          <Box
            sx={{
              bgcolor: "#9c27b0", // purple
              color: theme.palette.common.white,
              borderRadius: 2,
              textAlign: "center",
              py: 1,
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Total Fee: {totalFee.toLocaleString()} PKR
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{ p: 2 }}>
          <FormGroup>
            {/* All Subjects */}
            {allSubjects.find((s) => s.name === "All Subjects") && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedSubjects.includes("All Subjects")}
                    onChange={() => handleToggleSubject("All Subjects")}
                    disabled={isAllDisabled}
                    sx={{
                      color: theme.palette.primary.main,
                      "&.Mui-checked": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                    All Subjects
                  </Typography>
                }
              />
            )}

            <Divider sx={{ my: 2 }} />

            {/* Selective Subjects */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: "0.95rem",
                color: theme.palette.text.primary,
              }}
            >
              Selective Subjects
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  sm: "1fr 1fr 1fr",
                  md: "1fr 1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              {allSubjects
                .filter((s) => s.name !== "All Subjects")
                .map((subject) => (
                  <FormControlLabel
                    key={subject.name}
                    control={
                      <Checkbox
                        checked={selectedSubjects.includes(subject.name)}
                        onChange={() => handleToggleSubject(subject.name)}
                        sx={{
                          color: theme.palette.primary.main,
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "0.95rem" }}>
                        {subject.name}
                      </Typography>
                    }
                  />
                ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Study Mode */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: "0.95rem",
                color: theme.palette.text.primary,
              }}
            >
              Study Mode
            </Typography>
            <RadioGroup
              value={studyMode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStudyMode(e.target.value as StudyMode)
              }
            >
              <FormControlLabel
                value="academy"
                control={<Radio />}
                label={
                  <Typography sx={{ fontSize: "0.95rem" }}>
                    On Campus
                  </Typography>
                }
              />
              <FormControlLabel
                value="online"
                control={<Radio />}
                label={
                  <Typography sx={{ fontSize: "0.95rem" }}>Online</Typography>
                }
              />
              <FormControlLabel
                value="home"
                control={<Radio />}
                label={
                  <Typography sx={{ fontSize: "0.95rem" }}>
                    Home Tuition
                  </Typography>
                }
              />
            </RadioGroup>
          </FormGroup>

          {/* Close Button */}
          <Box sx={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default FeeStructureModal;
