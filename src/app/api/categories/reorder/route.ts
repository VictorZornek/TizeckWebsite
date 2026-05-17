import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { connectMongo } from "@/database/db";
import Category from "@/database/models/Category";
import { reorderCategoriesSchema } from "@/lib/validators/category";
import { verifyToken } from "@/lib/auth";
import { logError } from "@/lib/logger";

export async function PATCH(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reorderCategoriesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos. Envie um array orderedIds com os IDs das categorias ativas." },
        { status: 400 }
      );
    }

    const { orderedIds } = parsed.data;
    if (new Set(orderedIds).size !== orderedIds.length) {
      return NextResponse.json(
        { error: "A lista contém IDs duplicados" },
        { status: 400 }
      );
    }

    await connectMongo();

    const existing = await Category.find({ activated: true }).select("_id").lean();
    const existingIds = existing.map((d) =>
      String((d as { _id: { toString: () => string } })._id)
    );

    if (orderedIds.length !== existingIds.length) {
      return NextResponse.json(
        {
          error:
            "A ordem deve incluir todas as categorias ativas. Atualize a página e tente novamente.",
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
              "Um ou mais IDs são inválidos ou não pertencem a categorias ativas.",
          },
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

    const result = await Category.bulkWrite(operations);

    const matched =
      typeof result.matchedCount === "number"
        ? result.matchedCount
        : // compat com versões que expõem resultado aninhado
          (result as unknown as { result?: { nMatched?: number } }).result
            ?.nMatched;

    if (matched != null && matched !== orderedIds.length) {
      return NextResponse.json(
        {
          error:
            "Não foi possível atualizar todas as categorias. Atualize a página e tente novamente.",
        },
        { status: 409 }
      );
    }

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("CATEGORIES_REORDER", error);
    return NextResponse.json(
      { error: "Erro ao salvar a nova ordem das categorias" },
      { status: 500 }
    );
  }
}
