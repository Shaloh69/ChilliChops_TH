// app/api/db-debug/route.ts
import { NextResponse } from "next/server";
import { testDatabaseConnection } from "@/lib/dbDebug";

export async function GET() {
  console.log("🔍 [API] /api/db-debug called");

  try {
    const result = await testDatabaseConnection();

    if (result.success) {
      return NextResponse.json({
        status: "success",
        message: result.message,
        details: result.details,
      });
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: result.message,
          errorCode: result.errorCode,
          config: result.config,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ [API] Unhandled error in db-debug:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Unhandled error occurred in debugging endpoint",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
