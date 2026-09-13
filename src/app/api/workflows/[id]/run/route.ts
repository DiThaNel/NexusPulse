import { NextRequest, NextResponse } from "next/server";
import { runServerWorkflow } from "@/lib/server-workflows";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await runServerWorkflow(id);

    return NextResponse.json(
      {
        success: true,
        workflow: result.workflow,
        logs: result.generatedLogs,
        message: `Workflow '${result.workflow.name}' ejecutado exitosamente`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al ejecutar workflow", details: String(error) },
      { status: 500 }
    );
  }
}
