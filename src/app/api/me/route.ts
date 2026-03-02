import { NextResponse } from "next/server";
import { getUser } from "@/lib/server/session";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json(
    {
      user,
    },
    { status: 200 },
  );
}

