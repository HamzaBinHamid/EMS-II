//src/types/feeStructure.ts
export interface SubjectWithFee {
  name: string;
  fee: number;
}

export interface FeeStructure {
  id: number;
  order: number;
  grades: string;
  subjects_with_fee: SubjectWithFee[];
}

export interface SiblingDetail {
  grade: string;
  mode: string;
  subjects: string[];
  subjectType: "all" | "selective";
}
