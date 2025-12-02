import { NextResponse } from "next/server";
import { getCategoriesWithImages } from "@/database/services/productsService";

export async function GET() {
    try {
        const categories = await getCategoriesWithImages();
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        return NextResponse.json([], { status: 500 });
    }
}
