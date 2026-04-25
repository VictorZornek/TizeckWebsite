import { NextRequest, NextResponse } from "next/server";
import { connectBackupDatabase } from "@/database/dbBackup";

export async function GET(request: NextRequest) {
  try {
    const conn = await connectBackupDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

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
        const matchingCustomers = await customersCollection.find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { fantasyName: { $regex: search, $options: 'i' } },
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
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json({ error: `Erro ao buscar pedidos: ${error}` }, { status: 500 });
  }
}
