
// refundUtils.ts
// Helper utilities for refund calculations (not connected to app)

export function calculateRefund(amountPaid: number, cancellationFee: number) {
  return amountPaid - cancellationFee;
}

export function getRefundStatus(daysPassed: number) {
  if (daysPassed <= 2) return "Processing";
  if (daysPassed <= 5) return "Initiated";
  return "Completed";
}
