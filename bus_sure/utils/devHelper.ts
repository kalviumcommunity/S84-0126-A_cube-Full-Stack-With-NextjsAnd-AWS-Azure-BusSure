
// devHelper.ts
// This file is added for Pull Request practice.
// It is NOT connected to the main application.
// Safe for deployment because it is not imported anywhere.

export function projectInfo() {
  return {
    projectName: "BusSure - Intercity Bus Refund Transparency System",
    purpose: "Improve transparency in bus ticket cancellations and refunds",
    author: "Arman Singh",
    note: "This utility file is for development and PR workflow practice only."
  };
}

export function calculateRefundPercentage(amountPaid: number, cancellationCharge: number): number {
  if (amountPaid <= 0) return 0;
  const refund = amountPaid - cancellationCharge;
  return (refund / amountPaid) * 100;
}

// Example test usage (not executed anywhere in app)
const sample = calculateRefundPercentage(1000, 200);
console.log("Sample Refund Percentage:", sample);
