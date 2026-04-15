import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import Customer from "@/database/models/Customer";

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const state = searchParams.get("state") || "";
    const blocked = searchParams.get("blocked") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { fantasyName: { $regex: search, $options: "i" } },
        { cpfCnpj: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (state) {
      query.state = state;
    }

    if (blocked) {
      query.blocked = blocked;
    }

    const skip = (page - 1) * limit;
    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
    return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 });
  }
}
