import { NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import Employee from "@/database/models/Employee";

export async function GET() {
  try {
    const conn = await connectMongoLegacy();
    const EmployeeModel = conn.models.Employee || conn.model('Employee', Employee.schema);
    const employees = await EmployeeModel.find({ active: "S" }).sort({ name: 1 });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar funcionários: ${error}` }, { status: 500 });
  }
}
