import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parse = ContactSchema.safeParse(json);
  if (!parse.success) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }
  const data = parse.data;
  if (data.website && data.website.trim().length > 0) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
  console.log("contact_form_submission", data);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}


