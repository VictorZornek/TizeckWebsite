import { NextResponse } from "next/server";
import { getCategoriesWithImages } from "@/database/services/productsService";
import { connectMongo } from "@/database/db";
import Category from "@/database/models/Category";
import { createCategorySchema } from "@/lib/validators/category";
import { logError } from "@/lib/logger";

export async function GET() {
    try {
        const categories = await getCategoriesWithImages();
        return NextResponse.json(categories);
    } catch (error) {
        logError('CATEGORIES_GET', error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectMongo();
        const body = await request.json();
        
        const validation = createCategorySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        const { name, description, image } = validation.data;
        
        const category = new Category({
            name,
            description,
            image,
            activated: true
        });
        
        await category.save();
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        logError('CATEGORIES_CREATE', error);
        return NextResponse.json({ error: "Erro ao criar categoria" }, { status: 500 });
    }
}
