import { NextRequest, NextResponse } from "next/server";
import { connectBackupDatabase } from "@/database/dbBackup";
import { ordersQuerySchema } from "@/lib/validators/query";
import { escapeRegex, isValidDate } from "@/lib/validators/common";
import { logError } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const conn = await connectBackupDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const rawParams = {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "",
      dateFrom: searchParams.get("dateFrom") || "",
      dateTo: searchParams.get("dateTo") || "",
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "50",
    };

    const validation = ordersQuerySchema.safeParse(rawParams);
    if (!validation.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { search, status, dateFrom, dateTo, page, limit } = validation.data;

    // Validar datas se fornecidas
    if (dateFrom && !isValidDate(dateFrom)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    if (dateTo && !isValidDate(dateTo)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const query: Record<string, unknown> = {};

    if (search) {
      const searchNumber = parseInt(search);
      if (!isNaN(searchNumber)) {
        query.$or = [
          { legacyId: searchNumber },
          { customerLegacyId: searchNumber },
        ];
      } else {
        // Buscar clientes por nome primeiro
        const customersCollection = conn.db!.collection('legacycustomers');
        const escapedSearch = escapeRegex(search);
        const matchingCustomers = await customersCollection.find({
          $or: [
            { name: { $regex: escapedSearch, $options: 'i' } },
            { fantasyName: { $regex: escapedSearch, $options: 'i' } },
          ]
        }, { projection: { legacyId: 1 } }).toArray();
        
        const customerLegacyIds = matchingCustomers.map(c => c.legacyId);
        if (customerLegacyIds.length > 0) {
          query.customerLegacyId = { $in: customerLegacyIds };
        } else {
          // Se não encontrou clientes, retornar vazio
          query._id = null;
        }
      }
    }

    if (status) {
      query.status = status;
    }

    if (dateFrom || dateTo) {
      const dateQuery: Record<string, Date> = {};
      if (dateFrom) dateQuery.$gte = new Date(dateFrom);
      if (dateTo) dateQuery.$lte = new Date(dateTo);
      query.orderDate = dateQuery;
    }

    const skip = (page - 1) * limit;
    const ordersCollection = conn.db!.collection('legacyorders');
    const total = await ordersCollection.countDocuments(query);
    
    const orders = await ordersCollection.find(query)
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Buscar clientes manualmente
    const customerIds = [...new Set(orders.map(o => o.customerLegacyId).filter(Boolean))];
    const customersCollection = conn.db!.collection('legacycustomers');
    const customers = await customersCollection.find({ legacyId: { $in: customerIds } }).toArray();
    const customerMap = new Map(customers.map(c => [c.legacyId, c]));

    // Adicionar dados do cliente aos pedidos
    const ordersWithCustomers = orders.map(order => ({
      ...order,
      customer: customerMap.get(order.customerLegacyId) || null,
    }));

    return NextResponse.json({
      orders: ordersWithCustomers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logError('ORDERS_GET', error);
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}
