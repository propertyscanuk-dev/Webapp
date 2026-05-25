import Image from "next/image";

export type SampleDeal = {
  type: "BTL" | "HMO" | "BRRR" | "Flip";
  title: string;
  location: string;
  photo: string;
  askingPrice: string;
  sourcingFee: string;
  grossYield?: string;
  roi?: string;
  bmv: string;
  monthlyRent?: string;
};

const TYPE_COLOURS: Record<string, string> = {
  BTL:  "bg-blue-100 text-blue-700",
  HMO:  "bg-purple-100 text-purple-700",
  BRRR: "bg-orange-100 text-orange-700",
  Flip: "bg-pink-100 text-pink-600",
};

export default function DealPreviewCard({ deal }: { deal: SampleDeal }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Photo */}
      <div className="relative h-44 w-full">
        <Image
          src={deal.photo}
          alt={deal.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${TYPE_COLOURS[deal.type]}`}>
          {deal.type}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-sm font-semibold text-navy leading-snug mb-1">{deal.title}</h3>
        <p className="text-xs text-navy/40 mb-4">{deal.location}</p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-xs text-navy/40">Asking Price</p>
            <p className="text-sm font-semibold text-navy">{deal.askingPrice}</p>
          </div>
          <div>
            <p className="text-xs text-navy/40">Sourcing Fee</p>
            <p className="text-sm font-semibold text-teal">{deal.sourcingFee}</p>
          </div>
          {deal.grossYield && (
            <div>
              <p className="text-xs text-navy/40">Gross Yield</p>
              <p className="text-sm font-semibold text-navy">{deal.grossYield}</p>
            </div>
          )}
          {deal.roi && (
            <div>
              <p className="text-xs text-navy/40">ROI</p>
              <p className="text-sm font-semibold text-navy">{deal.roi}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-navy/40">BMV</p>
            <p className="text-sm font-semibold text-navy">{deal.bmv}</p>
          </div>
          {deal.monthlyRent && (
            <div>
              <p className="text-xs text-navy/40">Monthly Rent</p>
              <p className="text-sm font-semibold text-navy">{deal.monthlyRent}</p>
            </div>
          )}
        </div>

        <div className="w-full text-center text-sm bg-navy text-white font-medium py-2.5 rounded-lg opacity-60 cursor-default select-none">
          View Deal
        </div>
      </div>
    </div>
  );
}
