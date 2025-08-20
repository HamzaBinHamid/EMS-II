export interface SubjectWithFee {
  name: string;
  fee: number;
}

export interface FeeStructure {
  id: string;
  institute_category: string;
  grades: string[];
  created_at: string;
  study_mode: "In Academy" | "Home Tuition" | "Online"; // new column
  subjects_with_fee: SubjectWithFee[];
}
