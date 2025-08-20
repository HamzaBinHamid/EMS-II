///src/types/feeStructure.ts

export interface SubjectWithFee {
  name: string;
  fee: number;
}

export interface FeeStructure {
  id: string;
  grades: string; // 👈 changed from string[] to string
  subjects_with_fee: SubjectWithFee[];
}
