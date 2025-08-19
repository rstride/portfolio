import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(async () => {
      const form = await req.formData();
      return Object.fromEntries(form.entries());
    });
    console.log("Contact submission", data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

