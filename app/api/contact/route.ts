import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.log("Contact form submission (no Resend key configured):", { name, email, subject, message });
    return NextResponse.json({ ok: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "PropertyScan <noreply@propertyscan.uk>",
      to: ["hello@propertyscan.uk"],
      reply_to: email,
      subject: `[Contact] ${subject} — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
