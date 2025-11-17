import { FeeStructure, SiblingDetail } from "@/types/feeStructure";

export function calculateTotalFee(
  details: SiblingDetail[],
  feeStructures: FeeStructure[],
  skipSiblingDiscount: boolean = false
): number {
  let totalFee = 0;

  details.forEach((sibling) => {
    const feeStructure = feeStructures.find(
      (fs) => fs.grades === sibling.grade
    );
    if (!feeStructure) return;

    let siblingFee = 0;

    if (sibling.subjectType === "all") {
      const allSubject = feeStructure.subjects_with_fee.find(
        (s) => s.name === "All"
      );
      siblingFee = allSubject ? allSubject.fee : 0;
    } else if (sibling.subjectType === "selective") {
      const subjectCount = sibling.subjects.length;

      if (subjectCount > 4) {
        const allSubject = feeStructure.subjects_with_fee.find(
          (s) => s.name === "All"
        );
        siblingFee = allSubject ? allSubject.fee : 0;
      } else {
        const baseFee = feeStructure.subjects_with_fee
          .filter((s) => sibling.subjects.includes(s.name))
          .reduce((sum, subj) => sum + subj.fee, 0);

        let subjectDiscount = 0;
        if (subjectCount === 2) subjectDiscount = 0.2;
        else if (subjectCount === 3) subjectDiscount = 0.3;
        else if (subjectCount === 4) subjectDiscount = 0.4;

        siblingFee = baseFee - baseFee * subjectDiscount;
      }
    }

    if (sibling.mode === "On Campus") siblingFee *= 1;
    else if (sibling.mode === "Individual Focus / Online") siblingFee *= 2;
    else if (sibling.mode === "Home Tuition") siblingFee *= 3;

    totalFee += siblingFee;
  });

  if (!skipSiblingDiscount) {
    const siblingCount = details.length;
    let discount = 0;

    if (siblingCount >= 2) {
      discount = 0.2;
    }

    if (discount > 0) {
      totalFee = totalFee - totalFee * discount;
    }
  }

  // round to nearest 500
  totalFee = Math.round(totalFee / 500) * 500;

  return totalFee;
}

// 👉 Utility for commas in numbers
export function formatNumber(num: number): string {
  return num.toLocaleString("en-PK"); // e.g. 1,234,500
}
