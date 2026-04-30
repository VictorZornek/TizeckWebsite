import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectMongo } from "@/database/db";
import Products from "@/database/models/Product";
import { createProductSchema } from "@/lib/validators/product";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    await connectMongo();
    const products = await Products.find({ activated: true });
    return NextResponse.json(products);
  } catch (error) {
    logError('PRODUCTS_GET', error);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar body com Zod usando safeParse
    const result = createProductSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }
    
    const validatedData = result.data;
    
    await connectMongo();
    
    // Usar apenas campos validados (evita mass assignment)
    const product = new Products({ 
      name: validatedData.name,
      description: validatedData.description,
      category: validatedData.category,
      images: validatedData.images,
      specifications: validatedData.specifications,
    });
    await product.save();
    
    // Revalidar home e página de produtos da categoria
    revalidatePath("/");
    revalidatePath(`/products/${encodeURIComponent(validatedData.category)}`);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    logError('PRODUCTS_CREATE', error);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}