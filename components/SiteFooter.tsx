import SocialLinks from "./SocialLinks";

export default function SiteFooter() {
  return (
    <footer className="bg-navy border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <p className="text-white/30 text-xs">
          © 2026 PropertyScan UK Ltd · Registered in England and Wales
        </p>
        <SocialLinks />
      </div>
    </footer>
  );
}
