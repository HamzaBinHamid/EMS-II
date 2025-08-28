import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";
import { AdmissionFormData } from "@/types/admission";
import ToastNotification from "@/components/ToastNotification";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdmissionFormModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AdmissionFormData>({
    defaultValues: {
      siblingsCount: 0,
      students: [],
      fatherName: "",
      parentContact: "",
      homeAddress: "",
      terms: false,
    },
  });

  const siblingsCount = watch("siblingsCount");
  const { fields, replace } = useFieldArray({ control, name: "students" });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    id: string;
  } | null>(null);

  const updateSiblings = (count: number) => {
    if (count === 0) {
      replace([]);
      setValue("siblingsCount", 0);
      return;
    }
    const current = fields;
    const newFields = Array.from({ length: count }).map(
      (_, i) =>
        current[i] || {
          name: "",
          cnic: "",
          gender: "",
          grade: "",
          schoolCollege: "",
          subjects: "All",
        }
    );
    replace(newFields);
    setValue("siblingsCount", count);
  };

  const onSubmit = async (data: AdmissionFormData) => {
    setLoading(true);
    const { error } = await supabase.from("admissions").insert([
      {
        siblings_count: data.siblingsCount,
        students: data.students,
        father_name: data.fatherName,
        parent_contact: data.parentContact,
        home_address: data.homeAddress,
      },
    ]);
    setLoading(false);

    if (error) {
      console.error(error);
      setToast({
        message: "Failed to submit admission form.",
        type: "error",
        id: Date.now().toString(),
      });
    } else {
      setToast({
        message: "Admission form submitted successfully!",
        type: "success",
        id: Date.now().toString(),
      });
      reset(); // clear form
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle
          sx={{ fontWeight: 700, textAlign: "center", fontSize: "1.5rem" }}
        >
          Admission Form
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Siblings Count */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Number of Siblings
          </Typography>
          <RadioGroup
            row
            value={siblingsCount}
            onChange={(e) => updateSiblings(parseInt(e.target.value))}
          >
            {[0, 1, 2, 3, 4].map((num) => (
              <FormControlLabel
                key={num}
                value={num}
                control={<Radio />}
                label={num}
              />
            ))}
          </RadioGroup>

          <Divider sx={{ my: 2 }} />

          {/* Student Fields */}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 my-3 border rounded-xl shadow-sm bg-gray-50"
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Sibling {index + 1} of {siblingsCount}
              </Typography>

              {/* Name */}
              <Controller
                name={`students.${index}.name`}
                control={control}
                rules={{ required: "Student name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Student Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.students?.[index]?.name}
                    helperText={errors.students?.[index]?.name?.message}
                  />
                )}
              />

              {/* CNIC */}
              <Controller
                name={`students.${index}.cnic`}
                control={control}
                rules={{ required: "CNIC / Form-B is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="CNIC / Form-B"
                    fullWidth
                    margin="normal"
                    error={!!errors.students?.[index]?.cnic}
                    helperText={errors.students?.[index]?.cnic?.message}
                  />
                )}
              />

              {/* Gender */}
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                Gender
              </Typography>
              <Controller
                name={`students.${index}.gender`}
                control={control}
                rules={{ required: "Please select a gender" }}
                render={({ field }) => (
                  <>
                    <RadioGroup row {...field}>
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    </RadioGroup>
                    {errors.students?.[index]?.gender && (
                      <Typography variant="caption" color="error">
                        {errors.students[index]?.gender?.message}
                      </Typography>
                    )}
                  </>
                )}
              />

              {/* Grade */}
              <Controller
                name={`students.${index}.grade`}
                control={control}
                rules={{ required: "Grade is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Grade"
                    fullWidth
                    margin="normal"
                    error={!!errors.students?.[index]?.grade}
                    helperText={errors.students?.[index]?.grade?.message}
                  />
                )}
              />

              {/* School / College */}
              <Controller
                name={`students.${index}.schoolCollege`}
                control={control}
                rules={{ required: "School/College name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="School / College"
                    fullWidth
                    margin="normal"
                    error={!!errors.students?.[index]?.schoolCollege}
                    helperText={errors.students?.[index]?.schoolCollege?.message}
                  />
                )}
              />

              {/* Subjects */}
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                Subjects
              </Typography>
              <Controller
                name={`students.${index}.subjects`}
                control={control}
                rules={{ required: "Please select subjects option" }}
                render={({ field }) => (
                  <>
                    <RadioGroup
                      row
                      value={field.value || "All"}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <FormControlLabel value="All" control={<Radio />} label="All" />
                      <FormControlLabel
                        value="Selective"
                        control={<Radio />}
                        label="Selective Subjects"
                      />
                    </RadioGroup>

                    {field.value !== "All" && field.value !== "" && field.value !== "Selective" && (
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Enter Subjects"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        error={!!errors.students?.[index]?.subjects}
                        helperText={errors.students?.[index]?.subjects?.message}
                      />
                    )}

                    {field.value === "Selective" && (
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Enter Subjects"
                        value={""}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="e.g. Math, Physics, Chemistry"
                        error={!!errors.students?.[index]?.subjects}
                        helperText={errors.students?.[index]?.subjects?.message}
                      />
                    )}
                  </>
                )}
              />
            </div>
          ))}

          {/* Parent Info */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Parent / Guardian Information
          </Typography>

          <Controller
            name="fatherName"
            control={control}
            rules={{ required: "Father's name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Father's Name"
                fullWidth
                margin="normal"
                error={!!errors.fatherName}
                helperText={errors.fatherName?.message}
              />
            )}
          />

          <Controller
            name="parentContact"
            control={control}
            rules={{ required: "Parent's contact is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Parent's Contact"
                fullWidth
                margin="normal"
                error={!!errors.parentContact}
                helperText={errors.parentContact?.message}
              />
            )}
          />

          <Controller
            name="homeAddress"
            control={control}
            rules={{ required: "Home address is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Home Address"
                fullWidth
                margin="normal"
                error={!!errors.homeAddress}
                helperText={errors.homeAddress?.message}
              />
            )}
          />

          {/* Terms */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Rules & Guidelines
          </Typography>
          <ul className="list-disc pl-6 text-sm space-y-1">
            <li>Mobile phones are prohibited for junior students.</li>
            <li>Dress appropriately to ensure a respectful environment.</li>
            <li>Maintain courteous behavior with everyone.</li>
            <li>Students must secure at least 70% marks to continue enrollment.</li>
            <li>Cheating results in a zero mark and disciplinary action.</li>
            <li>Security cameras monitor exam rooms for integrity.</li>
          </ul>

          <Controller
            name="terms"
            control={control}
            rules={{ required: "You must accept the rules" }}
            render={({ field }) => (
              <>
                <FormControlLabel
                  sx={{ mt: 2 }}
                  control={<Checkbox {...field} checked={field.value} />}
                  label="I acknowledge and agree to the rules"
                />
                {errors.terms && (
                  <Typography variant="caption" color="error">
                    {errors.terms.message}
                  </Typography>
                )}
              </>
            )}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          id={toast.id}
          message={toast.message}
          type={toast.type}
          autoClose={3000}
          onClose={() => setToast(null)} // 👈 dismiss properly
        />
      )}
    </>
  );
}
