import { NextRequest, NextResponse } from "next/server";
import { connectBackupDatabase } from "@/database/dbBackup";
import { customersQuerySchema } from "@/lib/validators/query";
import { escapeRegex } from "@/lib/validators/common";

export async function GET(request: NextRequest) {
  try {
    const conn = await connectBackupDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const rawParams = {
      search: searchParams.get("search") || "",
      city: searchParams.get("city") || "",
      state: searchParams.get("state") || "",
      blocked: searchParams.get("blocked") || "",
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "50",
    };

    const validation = customersQuerySchema.safeParse(rawParams);
    if (!validation.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { search, city, state, blocked, page, limit } = validation.data;

    const query: Record<string, unknown> = {};

    if (search) {
      const escapedSearch = escapeRegex(search);
      query.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { fantasyName: { $regex: escapedSearch, $options: "i" } },
        { cpfCnpj: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (city) {
      query.city = { $regex: escapeRegex(city), $options: "i" };
    }

    if (state) {
      query.state = state;
    }

    if (blocked) {
      query.blocked = blocked === 'true';
    }

    const skip = (page - 1) * limit;
    const collection = conn.db!.collection('legacycustomers');
    const total = await collection.countDocuments(query);
    const customers = await collection.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      customers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 });
  }
}
