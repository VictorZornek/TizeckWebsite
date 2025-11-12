import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import Products from "@/database/models/Product";

export async function GET() {
  try {
    await connectMongo();
    const products = await Products.find({ activated: true });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, category, images, specifications } = await request.json();
    
    await connectMongo();
    
    const product = new Products({ 
      name, 
      description, 
      category, 
      images: images || [], 
      specifications: specifications || {} 
    });
    await product.save();
    
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}