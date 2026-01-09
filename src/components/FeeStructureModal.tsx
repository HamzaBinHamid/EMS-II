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
import theme from "@/ui/theme";

interface FeeStructureModalProps {
  open: boolean;
  onClose: () => void;
  feeStructures?: FeeStructure[]; // Make it optional with `?`
  onSave?: (data: {
    siblings: number;
    details: SiblingDetail[];
    acCharges: boolean;
    deservingDiscount: boolean;
  }) => void;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gradeOptions, setGradeOptions] = useState<string[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);

  // NEW: Extra charges / discounts
  const [acCharges, setAcCharges] = useState(false);
  const [deservingDiscount, setDeservingDiscount] = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setStep("siblings");
      setSiblings(0);
      setCurrentSibling(0);
      setDetails([]);
      setAcCharges(false);
      setDeservingDiscount(false);
    }
  }, [open]);

  // Fetch grade options + feeStructures
  useEffect(() => {
    const fetchGrades = async () => {
      const { data, error } = await supabase
        .from("fee_structure")
        .select("id, order, grades, subjects_with_fee");

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
    if (onSave) onSave({ siblings, details, acCharges, deservingDiscount });
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

  // ---- Fee Calculation with Extras ----
  const calculateFinalTotal = () => {
    let total = calculateTotalFee(details, feeStructures); // includes sibling discount

    if (acCharges) {
      total += siblings * 1000;
    }
    if (deservingDiscount) {
      total = total - total * 0.2;
    }

    return Math.round(total / 500) * 500;
  };

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
          maxHeight: "90vh",
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
                  label={
                    <>
                      {num} Sibling{num > 1 ? "s " : " "}
                      {num > 1 && (
                        <span
                          style={{
                            color: theme.palette.secondary.main,
                            fontWeight: 700,
                          }}
                        >
                          (20% Discounted)
                        </span>
                      )}
                    </>
                  }
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
                      {feeStructures
                        .sort((a, b) => a.order - b.order)
                        .map((feeStructure) => (
                          <MenuItem
                            key={feeStructure.id}
                            value={feeStructure.grades}
                          >
                            {/\d/.test(feeStructure.grades)
                              ? `Grade ${feeStructure.grades}`
                              : feeStructure.grades}
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
                    {[
                      "On Campus",
                      "Individual Focus / Online",
                      "Home Tuition",
                    ].map((option) => (
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
                <Box sx={{ maxHeight: "60vh", overflowY: "auto", padding: 2 }}>
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
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          mt: 2,
                          height: "40vh",
                          overflowY: "scroll",
                          pr: 1,
                        }}
                      >
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
                                </Box>
                              }
                            />
                          ))}
                      </Box>
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
                        ? "Check Fee"
                        : "Next Sibling"}
                    </Button>
                  </Box>
                </Box>
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
                    {/* Base Total */}
                    <Box
                      sx={{
                        textAlign: "center",
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        py: 1,
                        borderRadius: 2,
                        fontWeight: "bold",
                        fontSize: "1rem",
                        mb: 1,
                      }}
                    >
                      Total Fee: Rs. {formatNumber(calculateFinalTotal())}
                    </Box>

                    <FormGroup sx={{ mb: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={acCharges}
                            onChange={(e) => setAcCharges(e.target.checked)}
                            sx={{
                              transform: "scale(0.85)", // shrink further
                              padding: "2px",
                            }}
                          />
                        }
                        label={
                          <span>
                            AC charges <strong>Rs. 1,000 -/ sibling</strong>
                          </span>
                        }
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.75rem",
                          },
                        }}
                      />

                      <Divider sx={{ my: 0.5 }} />

                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={deservingDiscount}
                            onChange={(e) =>
                              setDeservingDiscount(e.target.checked)
                            }
                            sx={{
                              transform: "scale(0.85)",
                              padding: "2px",
                            }}
                          />
                        }
                        label={
                          <span>
                            Scholarship / Deserving Students{" "}
                            {/* <strong>20% Discount</strong> */}
                          </span>
                        }
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.75rem",
                          },
                        }}
                      />
                    </FormGroup>
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
                            ) : d.mode === "Individual Focus / Online" ? (
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
