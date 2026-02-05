import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, extractTokenFromRequest } from "@/lib/auth";
import ClaimTransactionService from "@/lib/claim-transaction-service";

const claimService = new ClaimTransactionService();

export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authorization token missing" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      busRegistrationNumber,
      busOperator,
      journeyDate,
      fromCity,
      toCity,
      ticketNumber,
      amountPaid,
      reason,
    } = body;

    if (
      !busRegistrationNumber ||
      !journeyDate ||
      !fromCity ||
      !toCity ||
      !ticketNumber ||
      !amountPaid ||
      !reason
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const amount = parseFloat(amountPaid);
    if (Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount paid must be a positive number" },
        { status: 400 }
      );
    }

    const incidentDate = new Date(journeyDate);
    if (Number.isNaN(incidentDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid journey date" },
        { status: 400 }
      );
    }

    // Ensure a Bus record exists for this registration number
    const bus = await prisma.bus.upsert({
      where: { registrationNumber: busRegistrationNumber },
      update: {
        updatedAt: new Date(),
      },
      create: {
        registrationNumber: busRegistrationNumber,
        make: busOperator || "Unknown",
        model: "Intercity",
        year: incidentDate.getFullYear(),
        capacity: 50,
      },
    });

    // Try to reuse an existing active policy for this user + bus, otherwise create a minimal one
    let policy = await prisma.policy.findFirst({
      where: {
        userId: decoded.id,
        busId: bus.id,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!policy) {
      const now = new Date();
      const end = new Date(now);
      end.setFullYear(end.getFullYear() + 1);

      policy = await prisma.policy.create({
        data: {
          policyNumber: `REF-${Date.now()}`,
          userId: decoded.id,
          busId: bus.id,
          startDate: now,
          endDate: end,
          premium: amount,
          coverage: amount,
          status: "ACTIVE",
        },
      });
    }

    const claimNumber = `CLM-${Date.now()}`;

    const description = [
      `Refund request for ticket ${ticketNumber}`,
      `Route: ${fromCity} → ${toCity}`,
      `Details: ${reason}`,
    ].join(" | ");

    const result = await claimService.createClaimWithAudit({
      userId: decoded.id,
      policyId: policy.id,
      incidentDate,
      description,
      amount,
      claimNumber,
    });

    return NextResponse.json({
      success: true,
      message: "Refund request submitted successfully",
      data: {
        claimId: result.claim.id,
        claimNumber: result.claim.claimNumber,
        status: result.claim.status,
      },
    });
  } catch (error) {
    console.error("Transparent refund creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit refund request",
      },
      { status: 500 }
    );
  }
}
