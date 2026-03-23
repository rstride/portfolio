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
          PRIVACY <br />
          <span className="text-primary">POLICY.</span>
        </h1>
        
        <div className="space-y-8 text-on-surface-variant leading-relaxed font-light">
        <section>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">1. Data Collection</h2>
          <p>
            This portfolio website does not collect any personal data without the user&apos;s knowledge. The only information collected is what you choose to transmit via the contact form (name, email address, message content).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">2. Data Usage</h2>
          <p>
            The information transmitted via the contact form is used exclusively for the purpose of responding to your request. It is never sold, transferred, or shared with third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">3. Cookies and Trackers</h2>
          <p>
            This site does not use intrusive advertising tracking or behavioral analysis cookies. Only technical cookies strictly necessary for the proper functioning of the site may be deposited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">4. Security</h2>
          <p>
            As a cybersecurity professional, I make it a point of honor to protect communications and exchanged data. The site is secured by PrismaSec and uses robust encryption protocols.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">5. Your Rights</h2>
          <p>
            In accordance with current regulations (GDPR), you have the right to access, rectify, delete, and oppose your personal data. To exercise these rights, please contact me via the dedicated form.
          </p>
        </section>
        </div>
      </div>
    </motion.div>
  );
}
