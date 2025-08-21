import { FeeStructure, SiblingDetail } from "@/types/feeStructure";

export function calculateTotalFee(
  details: SiblingDetail[],
  feeStructures: FeeStructure[]
): number {
  let totalFee = 0;

  details.forEach((sibling) => {
    const feeStructure = feeStructures.find(
      (fs) => fs.grades === sibling.grade
    );
    if (!feeStructure) return;

    let siblingFee = 0;

    if (sibling.subjectType === "all") {
      siblingFee = feeStructure.subjects_with_fee.reduce(
        (sum, subj) => sum + subj.fee,
        0
      );
    } else if (sibling.subjectType === "selective") {
      siblingFee = feeStructure.subjects_with_fee
        .filter((s) => sibling.subjects.includes(s.name))
        .reduce((sum, subj) => sum + subj.fee, 0);
    }

    // Mode multiplier
    if (sibling.mode === "On Campus") siblingFee *= 1;
    else if (sibling.mode === "Online") siblingFee *= 2;
    else if (sibling.mode === "Home Tuition") siblingFee *= 3;

    totalFee += siblingFee;
  });

  // Discounts
  const siblingCount = details.length;
  let discount = 0;
  if (siblingCount === 2) discount = 0.2;
  else if (siblingCount === 3) discount = 0.3;
  else if (siblingCount >= 4) discount = 0.35;

  if (discount > 0) {
    totalFee = totalFee - totalFee * discount;
  }

  return totalFee;
}
