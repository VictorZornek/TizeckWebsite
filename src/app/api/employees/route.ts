import { NextRequest, NextResponse } from "next/server";
import { connectBackupDatabase } from "@/database/dbBackup";
import Employee from "@/database/models/Employee";
import { employeesQuerySchema } from "@/lib/validators/query";
import { escapeRegex } from "@/lib/validators/common";

export async function GET(request: NextRequest) {
  try {
    const conn = await connectBackupDatabase();
    const EmployeeModel = conn.models.Employee || conn.model('Employee', Employee.schema);
    
    const searchParams = request.nextUrl.searchParams;
    const rawParams = {
      search: searchParams.get("search") || "",
      active: searchParams.get("active") || "",
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "50",
    };

    const validation = employeesQuerySchema.safeParse(rawParams);
    if (!validation.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { search, active, page, limit } = validation.data;

    const query: Record<string, unknown> = {};

    if (search) {
      const escapedSearch = escapeRegex(search);
      query.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { shortName: { $regex: escapedSearch, $options: "i" } },
        { cpf: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (active) {
      query.active = active === 'true';
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
    console.error('Erro ao buscar funcionários:', error);
    return NextResponse.json({ error: "Erro ao buscar funcionários" }, { status: 500 });
  }
}
