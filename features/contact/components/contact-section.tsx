"use client";

import { useRef } from "react";

import { motion, useInView } from "framer-motion";

import { site } from "@/content/site";
import { SectionIntro } from "@/shared/components/section-intro";
import { revealInView } from "@/shared/motion/reveal";

import { ContactForm } from "@/features/contact/components/contact-form";
import { ContactSidebar } from "@/features/contact/components/contact-sidebar";
import { useContactForm } from "@/features/contact/hooks/use-contact-form";

export function ContactSection() {
  const ref = useRef(null);
  useInView(ref, { once: true, amount: 0.2 });
  const form = useContactForm();

  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionIntro
        eyebrow="Contact"
        title={site.sections.contactTitle}
        description={site.sections.contactIntro}
      />

      <motion.div
        {...revealInView}
        transition={{ ...revealInView.transition, delay: 0.08 }}
        className="section-signal mx-auto mt-8 grid max-w-4xl gap-3 px-5 py-5 sm:grid-cols-3"
      >
        {site.sales.qualification.map((item) => (
          <div key={item} className="surface-subtle px-4 py-3 text-sm text-muted-foreground">
            {item}
          </div>
        ))}
      </motion.div>

      <div className="mx-auto mt-12 grid max-w-6xl items-start gap-8 xl:grid-cols-[minmax(0,1.12fr)_360px]">
        <motion.div {...revealInView} transition={{ ...revealInView.transition, delay: 0.12 }}>
          <ContactForm form={form} />
        </motion.div>

        <motion.div
          {...revealInView}
          transition={{ ...revealInView.transition, delay: 0.16 }}
          className="flex flex-col gap-6 lg:self-start"
        >
          <ContactSidebar />
        </motion.div>
      </div>
    </div>
  );
}
