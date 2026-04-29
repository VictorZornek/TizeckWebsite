import { NextRequest, NextResponse } from "next/server";
import { connectBackupDatabase } from "@/database/dbBackup";
import Account from "@/database/models/Account";

export async function GET(request: NextRequest) {
  try {
    const conn = await connectBackupDatabase();
    const AccountModel = conn.models.Account || conn.model('Account', Account.schema);
    
    const searchParams = request.nextUrl.searchParams;
    const customerCode = searchParams.get("customerCode") || "";
    const paymentType = searchParams.get("paymentType") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const query: Record<string, unknown> = {};

    if (customerCode) {
      query.customerSupplierCode = parseInt(customerCode);
    }

    if (paymentType) {
      query.paymentType = paymentType;
    }

    if (dateFrom || dateTo) {
      const dateQuery: Record<string, Date> = {};
      if (dateFrom) dateQuery.$gte = new Date(dateFrom);
      if (dateTo) dateQuery.$lte = new Date(dateTo);
      query.dueDate = dateQuery;
    }

    const skip = (page - 1) * limit;
    const total = await AccountModel.countDocuments(query);
    const accounts = await AccountModel.find(query)
      .sort({ dueDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      data: accounts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar contas: ${error}` }, { status: 500 });
  }
}
