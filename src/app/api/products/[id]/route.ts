import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import Products from "@/database/models/Product";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, description, category, images, specifications, activated } = await request.json();
    
    await connectMongo();
    
    const product = await Products.findByIdAndUpdate(
      id,
      { name, description, category, images, specifications, activated },
      { new: true }
    );
    
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectMongo();
    
    const product = await Products.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 });
  }
}