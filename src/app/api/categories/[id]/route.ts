import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import Category from "@/database/models/Category";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, description, image, activated } = await request.json();
    
    await connectMongo();
    
    const category = await Category.findByIdAndUpdate(
      params.id,
      { name, description, image, activated },
      { new: true }
    );
    
    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo();
    
    const category = await Category.findByIdAndDelete(params.id);
    
    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar categoria" }, { status: 500 });
  }
}