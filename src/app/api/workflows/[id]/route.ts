import { NextRequest, NextResponse } from "next/server";
import {
  toggleServerWorkflowStatus,
  deleteServerWorkflow,
  getServerWorkflowById,
} from "@/lib/server-workflows";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workflow = await getServerWorkflowById(id);

    if (!workflow) {
      return NextResponse.json(
        { error: `Workflow '${id}' no encontrado` },
        { status: 404 }
      );
    }

    return NextResponse.json(workflow, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener workflow", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    if (body.toggleStatus) {
      const updated = await toggleServerWorkflowStatus(id);
      return NextResponse.json(updated, { status: 200 });
    }

    return NextResponse.json(
      { error: "Operación PATCH no soportada" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar workflow", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteServerWorkflow(id);

    if (!deleted) {
      return NextResponse.json(
        { error: `Workflow '${id}' no encontrado` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar workflow", details: String(error) },
      { status: 500 }
    );
  }
}
