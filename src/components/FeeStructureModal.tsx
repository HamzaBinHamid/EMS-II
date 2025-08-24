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
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import supabase from "@/lib/supabase";
import { FeeStructure, SiblingDetail } from "@/types/feeStructure";
import { calculateTotalFee, formatNumber } from "@/utils/calculateTotalFee";

// In your FeeStructureModal component file
interface FeeStructureModalProps {
  open: boolean;
  onClose: () => void;
  instituteName: string | null;
  feeStructures: FeeStructure[];
  onSave?: (data: { siblings: number; details: SiblingDetail[] }) => void;
}
const STEPS = ["Grade", "Mode", "Subjects", "Fee"];

const FeeStructureModal: React.FC<FeeStructureModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [step, setStep] = useState<
    "siblings" | "grade" | "mode" | "subjects" | "summary"
  >("siblings");
  const [subjectOptions, setSubjectOptions] = useState<
    { name: string; fee: number }[]
  >([]);
  const [siblings, setSiblings] = useState<number>(0);
  const [currentSibling, setCurrentSibling] = useState(0);
  const [details, setDetails] = useState<SiblingDetail[]>([]);
  const [gradeOptions, setGradeOptions] = useState<string[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setStep("siblings");
      setSiblings(0);
      setCurrentSibling(0);
      setDetails([]);
    }
  }, [open]);

  // Fetch grade options + feeStructures
  useEffect(() => {
    const fetchGrades = async () => {
      const { data, error } = await supabase
        .from("fee_structure")
        .select("id, grades, subjects_with_fee");

      if (error) {
        console.error("Error fetching grades:", error);
        return;
      }

      if (data) {
        const structures = data as FeeStructure[];
        setFeeStructures(structures);
        const uniqueGrades = Array.from(
          new Set(structures.map((i) => i.grades))
        );
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
          subjectType: "all" as "all" | "selective",
        }))
    );
    setStep("grade");
    setCurrentSibling(0);
  };

  const handleGradeChange = (grade: string) => {
    const updated = [...details];
    updated[currentSibling].grade = grade;
    setDetails(updated);
    setStep("mode");

    const structure = feeStructures.find((fs) => fs.grades === grade);
    if (structure) {
      setSubjectOptions(structure.subjects_with_fee);
    }
  };

  const handleModeChange = (mode: string) => {
    const updated = [...details];
    updated[currentSibling].mode = mode;
    setDetails(updated);
    setStep("subjects");
  };

  const handleSubjectTypeChange = (type: "all" | "selective") => {
    const updated = [...details];
    updated[currentSibling].subjectType = type;

    if (type === "all") {
      updated[currentSibling].subjects = ["All"];
    } else {
      updated[currentSibling].subjects = [];
    }

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
      setStep("summary");
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
    } else if (step === "summary") {
      setStep("subjects");
    }
  };

  const handleFinish = () => {
    if (onSave) onSave({ siblings, details });
    onClose();
  };

  const siblingTitle =
    step !== "summary" ? `Sibling ${currentSibling + 1} of ${siblings}` : "";
  const activeStepIndex =
    step === "grade"
      ? 0
      : step === "mode"
      ? 1
      : step === "subjects"
      ? 2
      : step === "summary"
      ? 3
      : -1;

  // ---- Render ----
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
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh", // prevent modal overflow
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

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

        {step !== "siblings" && (
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
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

            <Box
              mt={3}
              sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              {/* Grade */}
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

              {/* Mode */}
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

              {/* Subjects */}
              {step === "subjects" && (
                <>
                  <RadioGroup
                    value={details[currentSibling]?.subjectType || ""}
                    onChange={(e) =>
                      handleSubjectTypeChange(
                        e.target.value as "all" | "selective"
                      )
                    }
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
                      {subjectOptions
                        .filter((s) => s.name !== "All")
                        .map((subject) => (
                          <FormControlLabel
                            key={subject.name}
                            control={
                              <Checkbox
                                checked={details[
                                  currentSibling
                                ].subjects.includes(subject.name)}
                                onChange={() =>
                                  handleSubjectToggle(subject.name)
                                }
                              />
                            }
                            label={
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                width="100%"
                              >
                                <Typography>{subject.name}</Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Rs. {formatNumber(subject.fee)}
                                </Typography>
                              </Box>
                            }
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
                        ? "Summary"
                        : "Next Sibling"}
                    </Button>
                  </Box>
                </>
              )}

              {/* Summary */}
              {step === "summary" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    maxHeight: "65vh",
                  }}
                >
                  {/* Top Section: Total Fee + Discount */}
                  <Box sx={{ mb: 2 }}>
                    {/* Total Fee */}
                    <Box
                      sx={{
                        textAlign: "center",
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        py: 2,
                        borderRadius: 2,
                        fontWeight: "bold",
                        fontSize: "1.7rem",
                        mb: 1,
                      }}
                    >
                      Total Fee: Rs.{" "}
                      {calculateTotalFee(
                        details,
                        feeStructures
                      ).toLocaleString()}
                    </Box>
                    {/* Discount */}
                    {siblings > 1 &&
                      (() => {
                        // Calculate base total (without sibling discount, but with mode and subject discounts)
                        const baseTotal = details.reduce((sum, d) => {
                          const fs = feeStructures.find(
                            (f) => f.grades === d.grade
                          );
                          if (!fs) return sum;

                          let siblingFee = 0;

                          if (d.subjectType === "all") {
                            const allFee = fs.subjects_with_fee.find(
                              (s) => s.name === "All"
                            );
                            siblingFee = allFee?.fee || 0;
                          } else {
                            const subjectCount = d.subjects.length;
                            if (subjectCount > 4) {
                              const allFee = fs.subjects_with_fee.find(
                                (s) => s.name === "All"
                              );
                              siblingFee = allFee?.fee || 0;
                            } else {
                              const baseFee = fs.subjects_with_fee
                                .filter((s) => d.subjects.includes(s.name))
                                .reduce((s, subj) => s + subj.fee, 0);

                              // Apply subject count discounts
                              let subjectDiscount = 0;
                              if (subjectCount === 2) subjectDiscount = 0.2;
                              else if (subjectCount === 3)
                                subjectDiscount = 0.3;
                              else if (subjectCount === 4)
                                subjectDiscount = 0.4;

                              siblingFee = baseFee - baseFee * subjectDiscount;
                            }
                          }

                          // Apply mode multiplier
                          if (d.mode === "On Campus") siblingFee *= 1;
                          else if (d.mode === "Online") siblingFee *= 2;
                          else if (d.mode === "Home Tuition") siblingFee *= 3;

                          return sum + siblingFee;
                        }, 0);

                        const discountPercent =
                          siblings === 2
                            ? 20
                            : siblings === 3
                            ? 30
                            : siblings >= 4
                            ? 35
                            : 0;

                        const discountedTotal = calculateTotalFee(
                          details,
                          feeStructures
                        );
                        const discountAmount = baseTotal - discountedTotal;

                        // Round discount to nearest 500
                        const roundedDiscount =
                          Math.round(discountAmount / 500) * 500;

                        return (
                          <Typography
                            variant="subtitle1"
                            align="center"
                            sx={{
                              color: "red",
                              fontWeight: "bold",
                            }}
                          >
                            Siblings Discount Applied ≈ {discountPercent}%{" "}
                            <br />
                            You Saved ≈ Rs. {formatNumber(roundedDiscount)}
                          </Typography>
                        );
                      })()}{" "}
                  </Box>

                  {/* Scrollable Sibling Details */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      overflowY: "auto",
                      pr: 1,
                      mb: 2,
                    }}
                  >
                    {details.map((d, idx) => (
                      <Box key={idx} mb={2}>
                        <Typography variant="h6">
                          <strong>Sibling {idx + 1}</strong>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Grade:</strong> {d.grade}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Mode:</strong> {d.mode}{" "}
                          <em>
                            (
                            {d.mode === "On Campus" ? (
                              <>
                                <strong>1 x </strong> Fee Charges
                              </>
                            ) : d.mode === "Online" ? (
                              <>
                                <strong>2 x </strong> Fee Charges
                              </>
                            ) : (
                              <>
                                <strong>3 x </strong> Fee Charges
                              </>
                            )}
                            )
                          </em>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Subjects:</strong>{" "}
                          {d.subjectType === "all"
                            ? "All Subjects"
                            : d.subjects.join(", ")}
                        </Typography>

                        {idx < details.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))}
                  </Box>

                  {/* Buttons */}
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Button variant="outlined" onClick={handleBack}>
                      Back
                    </Button>
                    <Button variant="contained" onClick={handleFinish}>
                      Finish
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default FeeStructureModal;
