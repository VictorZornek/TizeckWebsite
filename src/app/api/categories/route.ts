import { NextResponse } from "next/server";
import { getCategoriesWithImages } from "@/database/services/productsService";
import { connectMongo } from "@/database/db";
import Category from "@/database/models/Category";

export async function GET() {
    try {
        const categories = await getCategoriesWithImages();
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectMongo();
        const body = await request.json();
        
        const category = new Category({
            name: body.name,
            description: body.description,
            image: body.image,
            activated: true
        });
        
        await category.save();
        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        console.error("Erro ao criar categoria:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
