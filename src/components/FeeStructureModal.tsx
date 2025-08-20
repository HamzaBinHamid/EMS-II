import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import supabase from "@/lib/supabase"; // ✅ correct import path you shared
import { FeeStructure } from "@/types/feeStructure";

interface FeeStructureModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: {
    siblings: number;
    details: {
      grade: string;
      mode: string;
      subjects: string[];
      subjectType: string;
    }[];
  }) => void;
}

const STEPS = ["Grade", "Mode", "Subjects"];

const FeeStructureModal: React.FC<FeeStructureModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [step, setStep] = useState<"siblings" | "grade" | "mode" | "subjects">(
    "siblings"
  );
  const [subjectOptions, setSubjectOptions] = useState<
    { name: string; fee: number }[]
  >([]);

  const [siblings, setSiblings] = useState<number>(0);
  const [currentSibling, setCurrentSibling] = useState(0);

  const [details, setDetails] = useState<
    { grade: string; mode: string; subjects: string[]; subjectType: string }[]
  >([]);

  const [gradeOptions, setGradeOptions] = useState<string[]>([]);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setStep("siblings");
      setSiblings(0);
      setCurrentSibling(0);
      setDetails([]);
    }
  }, [open]);

  // Fetch grade options from Supabase
  useEffect(() => {
    const fetchGrades = async () => {
      const { data, error } = await supabase
        .from("fee_structure")
        .select("grades"); // 👈 "grades" is now text (not array)

      if (error) {
        console.error("Error fetching grades:", error);
        return;
      }

      if (data) {
        const feeStructures = data as Pick<FeeStructure, "grades">[];
        const uniqueGrades = Array.from(
          new Set(feeStructures.map((item) => item.grades))
        ); // 👈 no flatMap
        setGradeOptions(uniqueGrades);
      }
    };

    fetchGrades();
  }, []);

  // ---- Handlers ----
  const handleSelectSiblings = (value: number) => {
    setSiblings(value);
    setDetails(
      Array(value)
        .fill(null)
        .map(() => ({
          grade: "",
          mode: "",
          subjects: [],
          subjectType: "",
        }))
    );
    setStep("grade");
    setCurrentSibling(0);
  };

const handleGradeChange = async (grade: string) => {
  const updated = [...details];
  updated[currentSibling].grade = grade;
  setDetails(updated);
  setStep("mode");

  // ✅ Match grade (string now)
  const { data, error } = await supabase
    .from("fee_structure")
    .select("subjects_with_fee")
    .eq("grades", grade)   // 👈 changed from .contains to .eq
    .single();

  if (error) {
    console.error("Error fetching subjects:", error);
    return;
  }

  if (data) {
    setSubjectOptions(data.subjects_with_fee); // [{ name: "Math", fee: 2000 }, ...]
  }
};

  const handleModeChange = (mode: string) => {
    const updated = [...details];
    updated[currentSibling].mode = mode;
    setDetails(updated);
    setStep("subjects");
  };

  const handleSubjectTypeChange = (type: string) => {
    const updated = [...details];
    updated[currentSibling].subjectType = type;
    updated[currentSibling].subjects =
      type === "all" ? subjectOptions.map((s) => s.name) : [];
    setDetails(updated);
  };

  const handleSubjectToggle = (subject: string) => {
    const updated = [...details];
    const siblingData = updated[currentSibling];
    if (siblingData.subjects.includes(subject)) {
      siblingData.subjects = siblingData.subjects.filter((s) => s !== subject);
    } else {
      siblingData.subjects = [...siblingData.subjects, subject];
    }
    setDetails(updated);
  };

  const handleNextSibling = () => {
    if (currentSibling + 1 < siblings) {
      setCurrentSibling((prev) => prev + 1);
      setStep("grade");
    } else {
      if (onSave) onSave({ siblings, details });
      onClose();
    }
  };

  const handleBack = () => {
    if (step === "grade" && currentSibling === 0) {
      setStep("siblings");
    } else if (step === "grade") {
      setCurrentSibling((prev) => prev - 1);
      setStep("subjects");
    } else if (step === "mode") {
      setStep("grade");
    } else if (step === "subjects") {
      setStep("mode");
    }
  };

  // ---- Helpers ----
  const siblingTitle = `Sibling ${currentSibling + 1} of ${siblings}`;
  const activeStepIndex =
    step === "grade" ? 0 : step === "mode" ? 1 : step === "subjects" ? 2 : -1;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          width: { xs: "90%", sm: 500 },
          mx: "auto",
          mt: "5%",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Step 1: Select siblings */}
        {step === "siblings" && (
          <>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Fee Management
            </Typography>
            <RadioGroup
              value={siblings.toString()}
              onChange={(e) => handleSelectSiblings(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4].map((num) => (
                <FormControlLabel
                  key={num}
                  value={num.toString()}
                  control={<Radio />}
                  label={`${num} Sibling${num > 1 ? "s" : ""}`}
                />
              ))}
            </RadioGroup>
          </>
        )}

        {/* Steps for each sibling */}
        {step !== "siblings" && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              {siblingTitle}
            </Typography>

            <Stepper activeStep={activeStepIndex} alternativeLabel>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box mt={3}>
              {/* Step 2: Grade */}
              {step === "grade" && (
                <>
                  <FormControl fullWidth size="small" margin="normal">
                    <InputLabel>Grade</InputLabel>
                    <Select
                      value={details[currentSibling]?.grade || ""}
                      label="Grade"
                      onChange={(e) => handleGradeChange(e.target.value)}
                    >
                      {gradeOptions.map((g) => (
                        <MenuItem key={g} value={g}>
                          Grade {g}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box mt={2}>
                    <Button variant="outlined" onClick={handleBack}>
                      Back
                    </Button>
                  </Box>
                </>
              )}

              {/* Step 3: Mode */}
              {step === "mode" && (
                <>
                  <RadioGroup
                    value={details[currentSibling]?.mode || ""}
                    onChange={(e) => handleModeChange(e.target.value)}
                  >
                    {["On Campus", "Online", "Home Tuition"].map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>

                  <Box mt={2}>
                    <Button variant="outlined" onClick={handleBack}>
                      Back
                    </Button>
                  </Box>
                </>
              )}

              {/* Step 4: Subjects */}
              {step === "subjects" && (
                <>
                  <RadioGroup
                    value={details[currentSibling]?.subjectType || ""}
                    onChange={(e) => handleSubjectTypeChange(e.target.value)}
                  >
                    <FormControlLabel
                      value="all"
                      control={<Radio />}
                      label="All Subjects"
                    />
                    <FormControlLabel
                      value="selective"
                      control={<Radio />}
                      label="Selective Subjects"
                    />
                  </RadioGroup>

                  {details[currentSibling]?.subjectType === "selective" && (
                    <FormGroup>
                      {subjectOptions.map((subject) => (
                        <FormControlLabel
                          key={subject.name}
                          control={
                            <Checkbox
                              checked={details[
                                currentSibling
                              ].subjects.includes(subject.name)}
                              onChange={() => handleSubjectToggle(subject.name)}
                            />
                          }
                          label={`${subject.name}`}
                        />
                      ))}
                    </FormGroup>
                  )}

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button variant="outlined" onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNextSibling}
                      disabled={
                        !details[currentSibling]?.subjectType ||
                        (details[currentSibling]?.subjectType === "selective" &&
                          details[currentSibling]?.subjects.length === 0)
                      }
                    >
                      {currentSibling + 1 === siblings
                        ? "Finish"
                        : "Next Sibling"}
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default FeeStructureModal;
