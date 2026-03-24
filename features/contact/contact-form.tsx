'use client';

import { useState } from 'react';
import { Send, ShieldCheck, AlertTriangle } from 'lucide-react';

type Locale = 'fr' | 'en';
type ContactField =
  | 'name'
  | 'email'
  | 'service'
  | 'message'
  | 'company'
  | 'phone'
  | 'referrer';

type FormState = Record<ContactField, string>;
type FieldErrors = Partial<Record<ContactField, string>>;

const initialState: FormState = {
  name: '',
  email: '',
  service: '',
  message: '',
  company: '',
  phone: '',
  referrer: '',
};

const copy = {
  fr: {
    panelTitle: 'SECURE_MESSAGE_PROTOCOL',
    intro: 'Décrivez votre besoin avec suffisamment de contexte pour orienter le cadrage technique.',
    labels: {
      name: 'IDENTIFIER (NOM)',
      email: 'RETURN_ADDRESS (EMAIL)',
      service: 'ENGAGEMENT_TYPE (SERVICE)',
      company: 'ORGANIZATION (OPTIONAL)',
      phone: 'VOICE_CHANNEL (TÉLÉPHONE)',
      message: 'PAYLOAD (MESSAGE)',
    },
    options: {
      service: ['Web Application Pentest', 'Infrastructure Audit', 'Security Training', 'Advisory / Architecture'],
    },
    submit: 'TRANSMIT_DATA',
    pending: 'TRANSMISSION...',
    success: 'Message transmis. Le canal est ouvert.',
    failure: 'Transmission impossible pour le moment. Réessayez plus tard.',
  },
  en: {
    panelTitle: 'SECURE_MESSAGE_PROTOCOL',
    intro: 'Describe the request with enough context to guide the technical scoping stage.',
    labels: {
      name: 'IDENTIFIER (NAME)',
      email: 'RETURN_ADDRESS (EMAIL)',
      service: 'ENGAGEMENT_TYPE (SERVICE)',
      company: 'ORGANIZATION (OPTIONAL)',
      phone: 'VOICE_CHANNEL (PHONE)',
      message: 'PAYLOAD (MESSAGE)',
    },
    options: {
      service: ['Web Application Pentest', 'Infrastructure Audit', 'Security Training', 'Advisory / Architecture'],
    },
    submit: 'TRANSMIT_DATA',
    pending: 'TRANSMITTING...',
    success: 'Message transmitted. Channel established.',
    failure: 'Transmission failed for now. Please try again later.',
  },
} satisfies Record<Locale, {
  panelTitle: string;
  intro: string;
  labels: Record<Exclude<ContactField, 'referrer'>, string>;
  options: {
    service: string[];
  };
  submit: string;
  pending: string;
  success: string;
  failure: string;
}>;

export function ContactForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  function updateField(field: ContactField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    const result = (await response.json()) as {
      ok?: boolean;
      fieldErrors?: FieldErrors;
      error?: string;
    };

    if (!response.ok) {
      setErrors(result.fieldErrors ?? {});
      setFormMessage({
        tone: 'error',
        text: result.error || t.failure,
      });
      setIsSubmitting(false);
      return;
    }

    setValues(initialState);
    setErrors({});
    setFormMessage({
      tone: 'success',
      text: t.success,
    });
    setIsSubmitting(false);
  }

  const statusToneClass =
    formMessage?.tone === 'success'
      ? 'border-primary/30 bg-primary/10 text-primary'
      : 'border-error/30 bg-error/10 text-error';

  return (
    <div className="xl:col-span-7 bg-surface-container-low p-8 md:p-12 xl:p-14 border border-outline-variant/20 relative tech-border">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>

      <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/20 pb-4">
        <Send className="w-5 h-5 text-primary" />
        <h3 className="font-mono text-sm uppercase text-on-surface tracking-widest">{t.panelTitle}</h3>
      </div>

      <p className="text-sm text-on-surface-variant font-light leading-relaxed mb-8 max-w-2xl">
        {t.intro}
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.referrer}
          onChange={(event) => updateField('referrer', event.target.value)}
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label={t.labels.name}
            value={values.name}
            error={errors.name}
            onChange={(value) => updateField('name', value)}
          />
          <Field
            label={t.labels.email}
            type="email"
            value={values.email}
            error={errors.email}
            onChange={(value) => updateField('email', value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <SelectField
            label={t.labels.service}
            value={values.service}
            error={errors.service}
            options={t.options.service}
            onChange={(value) => updateField('service', value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label={t.labels.company}
            value={values.company}
            error={errors.company}
            onChange={(value) => updateField('company', value)}
          />
          <Field
            label={t.labels.phone}
            value={values.phone}
            error={errors.phone}
            onChange={(value) => updateField('phone', value)}
          />
        </div>

        <TextAreaField
          label={t.labels.message}
          value={values.message}
          error={errors.message}
          onChange={(value) => updateField('message', value)}
        />

        {formMessage && (
          <div className={`flex items-center gap-3 border px-4 py-3 text-sm font-mono ${statusToneClass}`}>
            {formMessage.tone === 'success' ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{formMessage.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-on-primary font-mono text-sm font-bold uppercase px-8 py-4 transition-all terminal-glow active:scale-95 flex items-center justify-center gap-3 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? t.pending : t.submit}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  error,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full bg-surface-container border px-4 py-3 font-mono text-sm text-on-surface focus:outline-none transition-colors ${error ? 'border-error/40 focus:border-error' : 'border-outline-variant/30 focus:border-primary'}`}
      />
      {error && <p className="text-xs text-error font-mono">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  error,
  options,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full bg-surface-container border px-4 py-3 font-mono text-sm text-on-surface focus:outline-none transition-colors appearance-none ${error ? 'border-error/40 focus:border-error' : 'border-outline-variant/30 focus:border-primary'}`}
      >
        <option value=""></option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-error font-mono">{error}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  error,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">{label}</label>
      <textarea
        rows={6}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full bg-surface-container border px-4 py-3 font-mono text-sm text-on-surface focus:outline-none transition-colors resize-none ${error ? 'border-error/40 focus:border-error' : 'border-outline-variant/30 focus:border-primary'}`}
      />
      {error && <p className="text-xs text-error font-mono">{error}</p>}
    </div>
  );
}
