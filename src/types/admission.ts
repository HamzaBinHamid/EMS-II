// types/admission.ts
export interface AdmissionFormData {
  siblingsCount: number;
  students: {
    name: string;
    cnic: string;
    gender: "Male" | "Female" | "";   // allow empty default
    grade: string;
    schoolCollege: string;            // added field
    subjects: string | "All";         // allow All or text
  }[];
  fatherName: string;
  parentContact: string;
  homeAddress: string;
  terms: boolean;
}
