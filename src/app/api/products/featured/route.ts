import { NextResponse } from "next/server";
import { getFeaturedProducts } from "@/database/services/productsService";

export async function GET() {
    try {
        const products = await getFeaturedProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error("Erro ao buscar produtos em destaque:", error);
        return NextResponse.json([], { status: 500 });
    }
}
