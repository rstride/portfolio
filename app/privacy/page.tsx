import * as motion from 'motion/react-client';

export default function PrivacyPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="reading-frame frame-stack py-24 min-h-[80vh]"
    >
      <div className="reading-column">
        <span className="font-mono text-primary uppercase tracking-[0.3em] text-xs mb-6 block">
          Legal // Privacy
        </span>
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-12">
          POLITIQUE DE <br />
          <span className="text-primary">CONFIDENTIALITÉ.</span>
        </h1>
        
        <div className="space-y-8 text-on-surface-variant leading-relaxed font-light">
        <section>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">1. Collecte des données</h2>
          <p>
            Ce site vitrine ne collecte aucune donnée personnelle à l&apos;insu de l&apos;utilisateur. Les seules informations recueillies sont celles que vous choisissez de transmettre via le formulaire de contact (nom, adresse e-mail, type de demande, message, ainsi que le cas échéant votre société et téléphone).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">2. Utilisation des données</h2>
          <p>
            Les informations transmises via le formulaire de contact sont utilisées exclusivement dans le but de répondre à votre demande. Elles ne sont en aucun cas vendues, cédées ou partagées à des tiers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">3. Cookies et traceurs</h2>
          <p>
            Ce site n&apos;utilise pas de cookies de suivi publicitaire ou d&apos;analyse comportementale intrusifs. Seuls des cookies techniques strictement nécessaires au bon fonctionnement du site peuvent être déposés.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">4. Sécurité</h2>
          <p>
            En tant que professionnel de la cybersécurité, je mets un point d&apos;honneur à protéger les communications et les données échangées. Le site est sécurisé par PrismaSec et utilise des protocoles de chiffrement robustes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">5. Vos droits</h2>
          <p>
            Conformément à la réglementation en vigueur (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition concernant vos données personnelles. Pour exercer ces droits, veuillez me contacter via le formulaire dédié.
          </p>
        </section>
        </div>
      </div>
    </motion.div>
  );
}
