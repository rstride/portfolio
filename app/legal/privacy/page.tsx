import { site } from "@/content/site";

export const metadata = { title: site.strings.footerPrivacyLabel };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 prose prose-invert">
      <h1>{site.privacyContent.title}</h1>
      <p>Date d’effet : {site.privacy.effectiveDate}</p>
      <p>{site.privacyContent.intro}</p>
      <h2>{site.privacyContent.controllerLabel}</h2>
      <p>{site.name}, {site.privacy.address}</p>
      <h2>{site.privacyContent.legalBasisLabel}</h2>
      <p>{site.privacyContent.legalBasisText}</p>
      <h2>{site.privacyContent.retentionLabel}</h2>
      <p>{site.privacyContent.retentionText}</p>
      <h2>{site.privacyContent.rightsLabel}</h2>
      <p>{site.privacyContent.rightsText} {site.about.email}</p>
      <h2>{site.privacyContent.cookiesLabel}</h2>
      <p>{site.privacyContent.cookiesText}</p>
      <h2>{site.privacyContent.transfersLabel}</h2>
      <p>{site.privacyContent.transfersText}</p>
    </div>
  );
}


