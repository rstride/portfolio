import { Orbit, Waypoints, Layers3 } from 'lucide-react';
import * as motion from 'motion/react-client';
import { ContactForm } from '@/features/contact/contact-form';

export default function ContactPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-frame py-12 xl:py-20 min-h-[80vh] flex flex-col justify-center"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 xl:gap-20 items-center frame-stack">
        <div className="xl:col-span-5 2xl:pr-12">
          <span className="font-mono text-primary uppercase tracking-[0.3em] text-xs mb-6 block">
            Secure Channel // Establish Connection
          </span>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-8">
            INITIATE <br />
            <span className="text-primary">HANDSHAKE.</span>
          </h1>
          <p className="text-on-surface-variant text-lg xl:text-xl leading-relaxed font-light mb-12 max-w-lg">
            Pour toute demande d&apos;audit, de formation ou de collaboration technique. Les communications sont chiffrées de bout en bout.
          </p>

          <div className="space-y-5">
            <InfoPanel
              icon={<Orbit className="w-5 h-5 text-primary" />}
              title="ENGAGEMENT_TYPES"
              tone="primary"
              items={['Pentest applicatif', 'Audit infrastructure', 'Formation securite', 'Architecture / advisory']}
            />
            <InfoPanel
              icon={<Waypoints className="w-5 h-5 text-secondary" />}
              title="SCOPE_VECTOR"
              tone="secondary"
              items={['Application web / SaaS', 'API / backend', 'Cloud / infrastructure', 'Equipe / atelier']}
            />
            <InfoPanel
              icon={<Layers3 className="w-5 h-5 text-primary" />}
              title="PROCESS_CHAIN"
              tone="primary"
              items={['Qualification du besoin', 'Cadrage du perimetre', 'Execution technique', 'Livrables & restitution']}
            />
          </div>
        </div>

        <ContactForm locale="fr" />
      </div>
    </motion.div>
  );
}

function InfoPanel({
  icon,
  title,
  tone,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  tone: 'primary' | 'secondary';
  items: string[];
}) {
  return (
    <div className={`border p-5 bg-surface-container-low capability-process-panel ${tone === 'primary' ? 'capability-card-primary' : 'capability-card-secondary'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="capability-card-icon w-11 h-11">{icon}</div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">{title}</div>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 font-mono text-xs uppercase text-on-surface-variant">
            <span className={`mt-1 h-1.5 w-1.5 shrink-0 ${tone === 'primary' ? 'bg-primary' : 'bg-secondary'}`}></span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
