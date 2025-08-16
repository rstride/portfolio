import Image from "next/image";
import { site } from "@/content/site";

export function LogoCloud() {
  return (
    <div className="mt-12">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-center">
        {site.logos.map((logo) => (
          <div key={logo.alt} className="flex items-center justify-center opacity-70 hover:opacity-100 transition">
            <Image src={logo.src} alt={logo.alt} width={96} height={24} />
          </div>
        ))}
      </div>
    </div>
  );
}


