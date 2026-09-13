import { NextRequest, NextResponse } from "next/server";
import { getServerAnalytics } from "@/lib/server-analytics";
import { AnalyticsTimeRange } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rangeParam = searchParams.get("range") as AnalyticsTimeRange;
    const validRange: AnalyticsTimeRange =
      rangeParam === "7d" || rangeParam === "90d" ? rangeParam : "30d";

    const analytics = await getServerAnalytics(validRange);
    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener telemetría de analítica", details: String(error) },
      { status: 500 }
    );
  }
}
