import { dbConnect } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await dbConnect();
  return new NextResponse("connected");
}
