import { NextRequest, NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import Order from "@/database/models/Order";

export async function GET(request: NextRequest) {
  try {
    const conn = await connectMongoLegacy();
    const OrderModel = conn.models.LegacyOrder || conn.model('LegacyOrder', Order.schema);
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const query: any = {};

    if (search) {
      const searchNumber = parseInt(search);
      if (!isNaN(searchNumber)) {
        query.$or = [
          { legacyId: searchNumber },
          { customerLegacyId: searchNumber },
        ];
      }
    }

    if (status) {
      query.status = status;
    }

    if (dateFrom || dateTo) {
      query.orderDate = {};
      if (dateFrom) query.orderDate.$gte = new Date(dateFrom);
      if (dateTo) query.orderDate.$lte = new Date(dateTo);
    }

    const skip = (page - 1) * limit;
    const total = await OrderModel.countDocuments(query);
    const orders = await OrderModel.find(query)
      .populate("customerId", "name fantasyName")
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .select("+items") // Garantir que items seja incluído
      .lean();

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}
