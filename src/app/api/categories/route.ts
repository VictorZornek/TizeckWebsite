import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import Category from "@/database/models/Category";

export async function GET() {
  try {
    await connectMongo();
    const categories = await Category.find({ activated: true });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar categorias" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, image } = await request.json();
    
    await connectMongo();
    
    const category = new Category({ name, description, image });
    await category.save();
    
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar categoria" }, { status: 500 });
  }
}