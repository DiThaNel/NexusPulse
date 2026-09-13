import { NextRequest, NextResponse } from "next/server";
import { getServerWorkflows, createServerWorkflow } from "@/lib/server-workflows";
import { workflowSchema } from "@/lib/validations/workflow";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const trigger = searchParams.get("trigger") || undefined;

    const workflows = await getServerWorkflows({ search, status, trigger });
    return NextResponse.json(workflows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener workflows", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = workflowSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Datos de workflow inválidos",
          issues: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const created = await createServerWorkflow(validation.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear workflow", details: String(error) },
      { status: 500 }
    );
  }
}
