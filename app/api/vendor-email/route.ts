import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { vendorId, orderId } = await req.json();
  const service = createServiceClient();

  const [{ data: vendor }, { data: order }] = await Promise.all([
    service.from("vendors").select("*").eq("id", vendorId).single(),
    service.from("work_orders").select("*").eq("id", orderId).single(),
  ]);

  if (!vendor || !order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const photoHtml = order.image_url
    ? `<p><strong>Photo:</strong></p><img src="${order.image_url}" style="max-width:600px;width:100%;" />`
    : "";

  await resend.emails.send({
    from: "1708 Realty <onboarding@resend.dev>",
    to: vendor.email,
    subject: `Work Order: ${order.title}`,
    html: `
      <p>Hi ${vendor.name},</p>
      <p>We have a <strong>${order.category}</strong> issue and would like to schedule a visit.</p>
      <h2 style="font-size:18px;">${order.title}</h2>
      ${order.description ? `<p>${order.description.replace(/\n/g, "<br/>")}</p>` : ""}
      ${photoHtml}
      <p>Please reply to this email to confirm availability.</p>
      <p>Thank you,<br/>1708 Realty</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
