import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { verifyToken, extractTokenFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Extract and verify JWT token
    const token = extractTokenFromRequest(req as any);
    
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

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: decoded.id },
      data: { 
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during password reset" },
      { status: 500 }
    );
  }
}