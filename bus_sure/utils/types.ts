
// types.ts
// Sample TypeScript types for learning & PR practice

export interface RefundRequest {
  id: string;
  userName: string;
  ticketId: string;
  amountPaid: number;
  status: "Pending" | "Processing" | "Completed";
}

export interface CancellationRule {
  hoursBeforeDeparture: number;
  refundPercentage: number;
}
