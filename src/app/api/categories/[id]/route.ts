import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import Category from "@/database/models/Category";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, description, image, activated } = await request.json();
    
    await connectMongo();
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, image, activated },
      { new: true }
    );
    
    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectMongo();
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao deletar categoria" }, { status: 500 });
  }
}