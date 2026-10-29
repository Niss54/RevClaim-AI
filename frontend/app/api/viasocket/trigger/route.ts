import { NextRequest, NextResponse } from "next/server";
import {
  dispatchViaSocketWhatsApp,
  dispatchViaSocketSettlement,
  syncDebtorToViaSocketDb,
} from "@/lib/viasocket";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required ('whatsapp' | 'settlement' | 'db_sync')" },
        { status: 400 }
      );
    }

    if (action === "whatsapp") {
      const res = await dispatchViaSocketWhatsApp(payload);
      return NextResponse.json(res);
    }

    if (action === "settlement") {
      const res = await dispatchViaSocketSettlement(payload);
      return NextResponse.json(res);
    }

    if (action === "db_sync") {
      const res = await syncDebtorToViaSocketDb(payload);
      return NextResponse.json(res);
    }

    return NextResponse.json(
      { success: false, error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[viaSocket API Route Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to execute viaSocket workflow",
      },
      { status: 500 }
    );
  }
}
