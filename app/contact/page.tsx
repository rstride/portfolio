import { Send, Terminal } from 'lucide-react';
import * as motion from 'motion/react-client';

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

          <div className="space-y-8 font-mono text-sm">
            <div>
              <div className="text-on-surface-variant/60 uppercase tracking-widest text-[10px] mb-2">PGP FINGERPRINT</div>
              <div className="text-primary break-all bg-surface-container p-3 border border-outline-variant/20 inline-block">
                A1B2 C3D4 E5F6 7890 1234 5678 90AB CDEF 1234 5678
              </div>
            </div>
            
            <div>
              <div className="text-on-surface-variant/60 uppercase tracking-widest text-[10px] mb-2">DIRECT_EMAIL</div>
              <a href="mailto:admin@root_access.sec" className="text-on-surface hover:text-primary transition-colors">
                admin@root_access.sec
              </a>
            </div>
          </div>
        </div>

        <div className="xl:col-span-7 bg-surface-container-low p-8 md:p-12 xl:p-14 border border-outline-variant/20 relative tech-border">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/20 pb-4">
            <Terminal className="w-5 h-5 text-primary" />
            <h3 className="font-mono text-sm uppercase text-on-surface tracking-widest">SECURE_MESSAGE_PROTOCOL</h3>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">IDENTIFIER (NAME)</label>
                <input 
                  type="text" 
                  className="w-full bg-surface-container border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">RETURN_ADDRESS (EMAIL)</label>
                <input 
                  type="email" 
                  className="w-full bg-surface-container border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">ENGAGEMENT_TYPE</label>
              <select className="w-full bg-surface-container border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none">
                <option>Web Application Pentest</option>
                <option>Infrastructure Audit</option>
                <option>Security Training</option>
                <option>Other Inquiry</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">PAYLOAD (MESSAGE)</label>
              <textarea 
                rows={5}
                className="w-full bg-surface-container border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
                required
              ></textarea>
            </div>

            <button 
              type="button"
              className="w-full bg-primary text-on-primary font-mono text-sm font-bold uppercase px-8 py-4 transition-all terminal-glow active:scale-95 flex items-center justify-center gap-3 mt-8"
            >
              <Send className="w-4 h-4" />
              TRANSMIT_DATA
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
