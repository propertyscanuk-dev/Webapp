import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const C = {
  navy:      "#0D2137",
  teal:      "#2DD4BF",
  white:     "#FFFFFF",
  gray:      "#64748B",
  lightGray: "#F8FAFC",
  border:    "#E2E8F0",
  navyLight: "#132A45",
};

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", backgroundColor: C.white, color: C.navy },

  // ── Cover ──────────────────────────────────────────────────
  coverTop: {
    backgroundColor: C.navy,
    padding: 40,
    paddingBottom: 32,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  brandDot: {
    width: 8,
    height: 8,
    backgroundColor: C.teal,
    borderRadius: 4,
    marginRight: 8,
  },
  brandName: {
    fontSize: 14,
    color: C.white,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  brandSub: { fontSize: 14, color: C.teal, fontFamily: "Helvetica-Bold" },

  dealTypeBadge: {
    alignSelf: "flex-start",
    backgroundColor: C.teal,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 14,
  },
  dealTypeText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    letterSpacing: 1,
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    lineHeight: 1.3,
    marginBottom: 8,
  },
  coverLocation: { fontSize: 12, color: C.teal },

  heroImage: {
    width: "100%",
    height: 220,
    objectFit: "cover",
  },
  noPhoto: {
    width: "100%",
    height: 220,
    backgroundColor: C.navyLight,
    justifyContent: "center",
    alignItems: "center",
  },
  noPhotoText: { fontSize: 11, color: "#4A6580" },

  // Key metrics strip
  metricsStrip: {
    flexDirection: "row",
    backgroundColor: C.lightGray,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  metric: {
    flex: 1,
    padding: 14,
    borderRightWidth: 1,
    borderRightColor: C.border,
  },
  metricLast: { flex: 1, padding: 14 },
  metricLabel: { fontSize: 8, color: C.gray, marginBottom: 4, letterSpacing: 0.5 },
  metricValue: { fontSize: 14, fontFamily: "Helvetica-Bold", color: C.navy },
  metricValueTeal: { fontSize: 14, fontFamily: "Helvetica-Bold", color: C.teal },

  // ── Details page ──────────────────────────────────────────
  pageHeader: {
    backgroundColor: C.navy,
    paddingHorizontal: 40,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageHeaderTitle: { fontSize: 10, color: C.teal, fontFamily: "Helvetica-Bold", letterSpacing: 0.5 },
  pageHeaderBrand: { fontSize: 9, color: "#4A6580" },

  body: { padding: 40 },

  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    letterSpacing: 0.8,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  section: { marginBottom: 28 },

  row: { flexDirection: "row", marginBottom: 8 },
  label: { width: 130, fontSize: 9, color: C.gray },
  value: { flex: 1, fontSize: 9, color: C.navy, fontFamily: "Helvetica-Bold" },

  description: {
    fontSize: 9,
    color: C.gray,
    lineHeight: 1.7,
    backgroundColor: C.lightGray,
    padding: 14,
    borderRadius: 4,
  },

  // Fee table
  feeTable: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  feeHeader: {
    flexDirection: "row",
    backgroundColor: C.navy,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  feeHeaderText: { fontSize: 8, color: C.white, fontFamily: "Helvetica-Bold" },
  feeRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  feeRowHighlight: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: "#F0FDFB",
  },
  feeLabelCol: { flex: 1, fontSize: 9, color: C.gray },
  feeValueCol: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.navy },
  feeValueTeal: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.teal },
  feeLabelBold: { flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold", color: C.navy },

  // Sourcer box
  sourcerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.lightGray,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
    padding: 14,
    gap: 14,
  },
  sourcerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.navy,
    justifyContent: "center",
    alignItems: "center",
  },
  sourcerInitial: { fontSize: 14, color: C.teal, fontFamily: "Helvetica-Bold" },
  sourcerName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.navy, marginBottom: 2 },
  sourcerRole: { fontSize: 8, color: C.gray },
  sourcerVerified: { fontSize: 8, color: C.teal, marginTop: 2 },

  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
  },
  footerText: { fontSize: 7, color: "#94A3B8" },
  footerBrand: { fontSize: 7, color: C.teal, fontFamily: "Helvetica-Bold" },
});

// ── Helpers ──────────────────────────────────────────────────────────────

function fmt(pence: number) {
  return "£" + (pence / 100).toLocaleString("en-GB", { maximumFractionDigits: 0 });
}

function pct(n: number | null | undefined) {
  return n != null ? `${n}%` : "—";
}

export interface DealPackData {
  id: string;
  title: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  postcode: string;
  deal_type: string;
  asking_price: number;
  sourcing_fee: number;
  monthly_rent?: number | null;
  gross_yield_percent?: number | null;
  roi_percent?: number | null;
  bmv_percent?: number | null;
  description?: string | null;
  heroPhotoUrl?: string | null;
  sourcer: {
    full_name: string | null;
    company_name: string | null;
  };
}

// ── PDF Document ─────────────────────────────────────────────────────────

export default function DealPackPDF({ deal }: { deal: DealPackData }) {
  const address = [deal.address_line1, deal.address_line2, deal.city, deal.postcode]
    .filter(Boolean)
    .join(", ");

  const sourcerName = deal.sourcer.full_name ?? "Verified Sourcer";
  const sourcerInitial = sourcerName.charAt(0).toUpperCase();

  const platformFee = Math.round(deal.sourcing_fee * 0.05);
  const investorTotal = deal.sourcing_fee + platformFee;
  const commission = Math.round(deal.sourcing_fee * 0.2);
  const commissionVat = Math.round(commission * 0.2);
  const sourcerPayout = deal.sourcing_fee - commission - commissionVat;

  return (
    <Document
      title={`PropertyScan Deal Pack — ${deal.title}`}
      author="PropertyScan"
      subject="Property Deal Pack"
    >
      {/* ── Page 1: Cover ─────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        {/* Top nav bar */}
        <View style={styles.coverTop}>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandName}>
              Property<Text style={styles.brandSub}>Scan</Text>
            </Text>
          </View>

          <View style={styles.dealTypeBadge}>
            <Text style={styles.dealTypeText}>{deal.deal_type}</Text>
          </View>

          <Text style={styles.coverTitle}>{deal.title}</Text>
          <Text style={styles.coverLocation}>{address}</Text>
        </View>

        {/* Hero photo */}
        {deal.heroPhotoUrl ? (
          <Image src={deal.heroPhotoUrl} style={styles.heroImage} />
        ) : (
          <View style={styles.noPhoto}>
            <Text style={styles.noPhotoText}>No photo provided</Text>
          </View>
        )}

        {/* Key metrics strip */}
        <View style={styles.metricsStrip}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>ASKING PRICE</Text>
            <Text style={styles.metricValue}>{fmt(deal.asking_price)}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>SOURCING FEE</Text>
            <Text style={styles.metricValueTeal}>{fmt(deal.sourcing_fee)}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>GROSS YIELD</Text>
            <Text style={styles.metricValue}>{pct(deal.gross_yield_percent)}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>BMV</Text>
            <Text style={styles.metricValue}>{pct(deal.bmv_percent)}</Text>
          </View>
          <View style={styles.metricLast}>
            <Text style={styles.metricLabel}>ROI</Text>
            <Text style={styles.metricValue}>{pct(deal.roi_percent)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This deal pack is for verified investors only. Confidential.
          </Text>
          <Text style={styles.footerBrand}>PropertyScan · propertyscan.uk</Text>
        </View>
      </Page>

      {/* ── Page 2: Details & Fees ────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeaderTitle}>DEAL DETAILS</Text>
          <Text style={styles.pageHeaderBrand}>propertyscan.uk</Text>
        </View>

        <View style={styles.body}>
          {/* Property details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROPERTY DETAILS</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Full Address</Text>
              <Text style={styles.value}>{address}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Deal Type</Text>
              <Text style={styles.value}>{deal.deal_type}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Asking Price</Text>
              <Text style={styles.value}>{fmt(deal.asking_price)}</Text>
            </View>
            {deal.monthly_rent ? (
              <View style={styles.row}>
                <Text style={styles.label}>Monthly Rent</Text>
                <Text style={styles.value}>{fmt(deal.monthly_rent)}/mo</Text>
              </View>
            ) : null}
            {deal.gross_yield_percent ? (
              <View style={styles.row}>
                <Text style={styles.label}>Gross Yield</Text>
                <Text style={styles.value}>{deal.gross_yield_percent}%</Text>
              </View>
            ) : null}
            {deal.roi_percent ? (
              <View style={styles.row}>
                <Text style={styles.label}>ROI</Text>
                <Text style={styles.value}>{deal.roi_percent}%</Text>
              </View>
            ) : null}
            {deal.bmv_percent ? (
              <View style={styles.row}>
                <Text style={styles.label}>Below Market Value</Text>
                <Text style={styles.value}>{deal.bmv_percent}%</Text>
              </View>
            ) : null}
          </View>

          {/* Description */}
          {deal.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SOURCER NOTES</Text>
              <Text style={styles.description}>{deal.description}</Text>
            </View>
          ) : null}

          {/* Fee breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FEE BREAKDOWN</Text>
            <View style={styles.feeTable}>
              <View style={styles.feeHeader}>
                <Text style={[styles.feeHeaderText, { flex: 1 }]}>Item</Text>
                <Text style={styles.feeHeaderText}>Amount</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabelCol}>Sourcing fee</Text>
                <Text style={styles.feeValueCol}>{fmt(deal.sourcing_fee)}</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabelCol}>
                  5% buyer protection fee (PropertyScan)
                </Text>
                <Text style={styles.feeValueCol}>{fmt(platformFee)}</Text>
              </View>
              <View style={styles.feeRowHighlight}>
                <Text style={styles.feeLabelBold}>Total you pay</Text>
                <Text style={styles.feeValueTeal}>{fmt(investorTotal)}</Text>
              </View>
            </View>
          </View>

          {/* Sourcer */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>VERIFIED SOURCER</Text>
            <View style={styles.sourcerBox}>
              <View style={styles.sourcerAvatar}>
                <Text style={styles.sourcerInitial}>{sourcerInitial}</Text>
              </View>
              <View>
                <Text style={styles.sourcerName}>{sourcerName}</Text>
                {deal.sourcer.company_name ? (
                  <Text style={styles.sourcerRole}>{deal.sourcer.company_name}</Text>
                ) : null}
                <Text style={styles.sourcerVerified}>
                  ✓ AML Verified · PRS Member · ICO Registered
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            PropertyScan is an AML-compliant deal marketplace. This pack is for information only and does not constitute financial advice.
          </Text>
          <Text style={styles.footerBrand}>PropertyScan</Text>
        </View>
      </Page>
    </Document>
  );
}
