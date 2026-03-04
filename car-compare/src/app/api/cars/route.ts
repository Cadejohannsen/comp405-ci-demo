import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const yearMin = searchParams.get("yearMin");
    const yearMax = searchParams.get("yearMax");
    const bodyType = searchParams.get("bodyType");

    const where: Record<string, unknown> = {};
    if (make) where.make = { contains: make };
    if (model) where.model = { contains: model };
    if (yearMin || yearMax) {
      where.year = {
        ...(yearMin ? { gte: parseInt(yearMin) } : {}),
        ...(yearMax ? { lte: parseInt(yearMax) } : {}),
      };
    }
    if (bodyType) where.bodyType = bodyType;

    const cars = await prisma.car.findMany({
      where,
      include: {
        listings: {
          include: { dealer: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cars);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
