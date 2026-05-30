export const dynamic = "force-dynamic";

import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { supabaseAdmin } from "@/lib/supabase/service";
import DealPackPDF from "@/components/pdf/DealPackPDF";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Fetch deal (no join — avoids TypeScript inference issues)
  const { data: deal, error } = await supabaseAdmin
    .from("deals")
    .select("id, title, address_line1, address_line2, city, postcode, deal_type, asking_price, sourcing_fee, monthly_rent, gross_yield_percent, roi_percent, bmv_percent, description, status, sourcer_id")
    .eq("id", id)
    .single();

  if (error || !deal) {
    return new Response("Deal not found", { status: 404 });
  }

  if (!["active", "reserved", "sold"].includes(deal.status as string)) {
    return new Response("Deal not available", { status: 403 });
  }

  // Fetch sourcer profile separately
  const { data: sourcer } = await supabaseAdmin
    .from("profiles")
    .select("full_name, company_name")
    .eq("id", deal.sourcer_id)
    .single();

  // Fetch hero photo (first photo)
  let heroPhotoUrl: string | null = null;
  const { data: photos } = await supabaseAdmin
    .from("deal_photos")
    .select("storage_path")
    .eq("deal_id", id)
    .order("display_order", { ascending: true })
    .limit(1);

  if (photos && photos.length > 0) {
    const { data: signed } = await supabaseAdmin.storage
      .from("deal-photos")
      .createSignedUrl(photos[0].storage_path, 60);
    heroPhotoUrl = signed?.signedUrl ?? null;
  }

  const pdfData = {
    id: deal.id,
    title: deal.title,
    address_line1: deal.address_line1,
    address_line2: deal.address_line2,
    city: deal.city,
    postcode: deal.postcode,
    deal_type: deal.deal_type as string,
    asking_price: deal.asking_price,
    sourcing_fee: deal.sourcing_fee,
    monthly_rent: deal.monthly_rent,
    gross_yield_percent: deal.gross_yield_percent,
    roi_percent: deal.roi_percent,
    bmv_percent: deal.bmv_percent,
    description: deal.description,
    heroPhotoUrl,
    sourcer: {
      full_name: sourcer?.full_name ?? null,
      company_name: sourcer?.company_name ?? null,
    },
  };

  const buffer = await renderToBuffer(createElement(DealPackPDF, { deal: pdfData }));

  const filename = `PropertyScan-Deal-${deal.city.replace(/\s+/g, "-")}-${id.slice(0, 8)}.pdf`;

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
