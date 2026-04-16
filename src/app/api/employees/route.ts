import { NextRequest, NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import Employee from "@/database/models/Employee";

export async function GET(request: NextRequest) {
  try {
    const conn = await connectMongoLegacy();
    const EmployeeModel = conn.models.Employee || conn.model('Employee', Employee.schema);
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const active = searchParams.get("active") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortName: { $regex: search, $options: "i" } },
        { cpf: { $regex: search, $options: "i" } },
      ];
    }

    if (active) {
      query.active = active;
    }

    const skip = (page - 1) * limit;
    const total = await EmployeeModel.countDocuments(query);
    const employees = await EmployeeModel.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      data: employees,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar funcionários: ${error}` }, { status: 500 });
  }
}
