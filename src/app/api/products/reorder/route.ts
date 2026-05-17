import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { connectMongo } from "@/database/db";
import Products from "@/database/models/Product";
import { reorderProductsSchema } from "@/lib/validators/product";
import { verifyToken } from "@/lib/auth";
import { logError } from "@/lib/logger";

export async function PATCH(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reorderProductsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Dados inválidos. Envie category e orderedIds com os produtos ativos da categoria.",
        },
        { status: 400 }
      );
    }

    const { category, orderedIds } = parsed.data;
    const categoryKey = category.trim();

    if (new Set(orderedIds).size !== orderedIds.length) {
      return NextResponse.json(
        { error: "A lista contém IDs duplicados" },
        { status: 400 }
      );
    }

    await connectMongo();

    const existing = await Products.find({
      category: categoryKey,
      activated: true,
    })
      .select("_id")
      .lean();

    const existingIds = existing.map((d) =>
      String((d as { _id: { toString: () => string } })._id)
    );

    if (orderedIds.length !== existingIds.length) {
      return NextResponse.json(
        {
          error:
            "A lista deve incluir todos os produtos ativos desta categoria. Atualize a página e tente novamente.",
        },
        { status: 400 }
      );
    }

    const existingSet = new Set(existingIds);
    for (const id of orderedIds) {
      if (!existingSet.has(id)) {
        return NextResponse.json(
          {
            error:
              "Um ou mais IDs são inválidos ou não pertencem a produtos ativos desta categoria.",
          },
          { status: 400 }
        );
      }
    }

    const objectIds = orderedIds.map((id) => new Types.ObjectId(id));
    const docs = await Products.find({
      _id: { $in: objectIds },
      activated: true,
    })
      .select("_id category")
      .lean();

    if (docs.length !== orderedIds.length) {
      return NextResponse.json(
        { error: "Não foi possível validar todos os produtos." },
        { status: 400 }
      );
    }

    for (const d of docs) {
      const doc = d as { category?: string };
      if (doc.category !== categoryKey) {
        return NextResponse.json(
          { error: "Um ou mais produtos não pertencem à categoria informada." },
          { status: 400 }
        );
      }
    }

    const operations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id) },
        update: { $set: { displayOrder: (index + 1) * 10 } },
      },
    }));

    const result = await Products.bulkWrite(operations);

    const matched =
      typeof result.matchedCount === "number"
        ? result.matchedCount
        : (result as unknown as { result?: { nMatched?: number } }).result
            ?.nMatched;

    if (matched != null && matched !== orderedIds.length) {
      return NextResponse.json(
        {
          error:
            "Não foi possível atualizar todos os produtos. Atualize a página e tente novamente.",
        },
        { status: 409 }
      );
    }

    revalidatePath("/");
    revalidatePath(`/products/${encodeURIComponent(categoryKey)}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("PRODUCTS_REORDER", error);
    return NextResponse.json(
      { error: "Erro ao salvar a nova ordem dos produtos" },
      { status: 500 }
    );
  }
}
