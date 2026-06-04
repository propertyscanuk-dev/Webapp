const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = "PropertyScan <noreply@propertyscan.uk>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://propertyscan.uk";

async function send(to: string, subject: string, html: string) {
  if (!RESEND_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping send to", to, subject);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[email] Resend error", res.status, body, { to, subject });
  }
}

export async function sendVerificationApproved(to: string, name: string, role: "sourcer" | "investor") {
  const dashUrl = `${APP_URL}/dashboard/${role}`;
  await send(to, "Your PropertyScan account has been approved ✓", `
    <p>Hi ${name},</p>
    <p>Great news — your ${role} account on PropertyScan has been <strong>verified and approved</strong>.</p>
    ${role === "sourcer"
      ? `<p>You can now list deals on the marketplace. Head to your dashboard to get started.</p>`
      : `<p>You now have full access to the deal marketplace. Start browsing verified off-market deals.</p>`
    }
    <p><a href="${dashUrl}">Go to your dashboard →</a></p>
    <p>The PropertyScan Team</p>
  `);
}

export async function sendVerificationRejected(to: string, name: string, reason?: string) {
  await send(to, "Action required — PropertyScan verification", `
    <p>Hi ${name},</p>
    <p>Unfortunately we were unable to verify your account with the documents provided.</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
    <p>Please re-upload your documents via your dashboard and our team will review them again within 1 business day.</p>
    <p><a href="${APP_URL}/dashboard">Go to your dashboard →</a></p>
    <p>The PropertyScan Team</p>
  `);
}

export async function sendAdminNewVerification(userName: string, userEmail: string, role: string) {
  await send("ahoffman79@live.com", `New verification submitted — ${userName}`, `
    <p>A new ${role} has submitted their verification documents and is ready for review.</p>
    <p><strong>Name:</strong> ${userName}<br/>
    <strong>Email:</strong> ${userEmail}<br/>
    <strong>Role:</strong> ${role}</p>
    <p><a href="https://www.propertyscan.uk/dashboard/admin/verifications">Review now →</a></p>
    <p>The PropertyScan Team</p>
  `);
}

export async function sendDealReserved(to: string, sourcerName: string, dealTitle: string, dealId: string) {
  await send(to, `Your deal has been reserved — ${dealTitle}`, `
    <p>Hi ${sourcerName},</p>
    <p>An investor has reserved your deal: <strong>${dealTitle}</strong>.</p>
    <p>Payment will be processed via Stripe. You'll receive a confirmation and payout notification once the payment completes.</p>
    <p><a href="${APP_URL}/deals/${dealId}">View deal →</a></p>
    <p>The PropertyScan Team</p>
  `);
}

export async function sendNewMessage(
  to: string, recipientName: string,
  senderName: string, dealTitle: string,
  dealId: string, recipientRole: "sourcer" | "investor",
  senderId: string,
) {
  const messagesUrl = `${APP_URL}/dashboard/${recipientRole}/messages?deal=${dealId}&with=${senderId}`;
  await send(to, `New message from ${senderName} — ${dealTitle}`, `
    <p>Hi ${recipientName},</p>
    <p>You have a new message from <strong>${senderName}</strong> regarding <strong>${dealTitle}</strong>.</p>
    <p><a href="${messagesUrl}">Reply on PropertyScan →</a></p>
    <p style="color:#999;font-size:12px;">Please keep all communication within PropertyScan. Do not share contact details outside the platform.</p>
    <p>The PropertyScan Team</p>
  `);
}

export async function sendPaymentConfirmed(
  investorEmail: string, investorName: string,
  sourcerEmail: string, sourcerName: string,
  dealTitle: string, dealId: string,
  investorTotalPence: number, sourcerPayoutPence: number
) {
  const fmt = (p: number) => (p / 100).toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

  await Promise.all([
    send(investorEmail, `Payment confirmed — ${dealTitle}`, `
      <p>Hi ${investorName},</p>
      <p>Your payment of <strong>${fmt(investorTotalPence)}</strong> for <strong>${dealTitle}</strong> has been confirmed.</p>
      <p>The deal pack will be available in your dashboard shortly.</p>
      <p><a href="${APP_URL}/deals/${dealId}">View deal →</a></p>
      <p>The PropertyScan Team</p>
    `),
    send(sourcerEmail, `Deal sold — ${dealTitle}`, `
      <p>Hi ${sourcerName},</p>
      <p>Your deal <strong>${dealTitle}</strong> has been sold. Your net payout of <strong>${fmt(sourcerPayoutPence)}</strong> will arrive in your Stripe account within 2–3 business days.</p>
      <p><a href="${APP_URL}/dashboard/sourcer/payouts">View payouts →</a></p>
      <p>The PropertyScan Team</p>
    `),
  ]);
}
