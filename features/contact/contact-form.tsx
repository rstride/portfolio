'use client';

import { type FormEvent, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Send, ShieldCheck, AlertTriangle } from 'lucide-react';

import {
  contactServiceOptions,
  getContactFieldErrors,
  getContactServiceOption,
  hasContactFieldErrors,
  type ContactFieldErrors,
} from '@/features/contact/schema';

type Locale = 'fr' | 'en';
type ContactField =
  | 'name'
  | 'email'
  | 'service'
  | 'message'
  | 'company'
  | 'phone'
  | 'referrer';
type RequiredContactField = keyof ContactFieldErrors;

type FormState = Record<ContactField, string>;

const initialState: FormState = {
  name: '',
  email: '',
  service: '',
  message: '',
  company: '',
  phone: '',
  referrer: '',
};

function isRequiredContactField(field: ContactField): field is RequiredContactField {
  return field === 'name' || field === 'email' || field === 'service' || field === 'message';
}

const copy = {
  fr: {
    panelTitle: 'SECURE_MESSAGE_PROTOCOL',
    intro: 'Décrivez votre besoin avec suffisamment de contexte pour orienter le cadrage technique.',
    labels: {
      name: 'Nom ou équipe',
      email: 'Adresse e-mail',
      service: 'Type de demande',
      company: 'Organisation',
      phone: 'Téléphone',
      message: 'Message',
    },
    systemLabels: {
      name: 'IDENTIFIER',
      email: 'RETURN_ADDRESS',
      service: 'ENGAGEMENT_TYPE',
      company: 'ORGANIZATION_OPTIONAL',
      phone: 'VOICE_CHANNEL',
      message: 'PAYLOAD',
    },
    placeholders: {
      name: 'Nom, équipe ou organisation',
      email: 'vous@entreprise.com',
      message: 'Contexte, périmètre, échéance, environnement concerné…',
    },
    options: {
      emptyService: 'Sélectionner un type de demande',
    },
    preselectedService: (service: string) =>
      `Demande préselectionnée : ${service}. Vous pouvez modifier ce choix.`,
    submit: 'TRANSMIT_DATA',
    pending: 'TRANSMISSION...',
    pendingLabel: 'Envoi du message en cours',
    success: 'Message transmis. Le canal est ouvert.',
    failure: 'Transmission impossible pour le moment. Réessayez plus tard.',
    networkFailure:
      'Connexion interrompue. Réessayez ou écrivez directement à contact@rstride.fr.',
    trustNote: 'Réponse directe par e-mail. N’envoyez pas de secrets via ce formulaire.',
    privacyHref: '/privacy',
    privacyLabel: 'Confidentialité',
    required: 'requis',
  },
  en: {
    panelTitle: 'SECURE_MESSAGE_PROTOCOL',
    intro: 'Describe the request with enough context to guide the technical scoping stage.',
    labels: {
      name: 'Name or team',
      email: 'Email address',
      service: 'Request type',
      company: 'Organization',
      phone: 'Phone',
      message: 'Message',
    },
    systemLabels: {
      name: 'IDENTIFIER',
      email: 'RETURN_ADDRESS',
      service: 'ENGAGEMENT_TYPE',
      company: 'ORGANIZATION_OPTIONAL',
      phone: 'VOICE_CHANNEL',
      message: 'PAYLOAD',
    },
    placeholders: {
      name: 'Name, team, or organization',
      email: 'you@company.com',
      message: 'Context, scope, timeline, affected environment…',
    },
    options: {
      emptyService: 'Select a request type',
    },
    preselectedService: (service: string) =>
      `Preselected request: ${service}. You can change this.`,
    submit: 'TRANSMIT_DATA',
    pending: 'TRANSMITTING...',
    pendingLabel: 'Sending message',
    success: 'Message transmitted. Channel established.',
    failure: 'Transmission failed for now. Please try again later.',
    networkFailure:
      'Connection interrupted. Try again or email contact@rstride.fr directly.',
    trustNote: 'Direct reply by email. Do not send secrets through this form.',
    privacyHref: '/en/privacy',
    privacyLabel: 'Privacy',
    required: 'required',
  },
} satisfies Record<Locale, {
  panelTitle: string;
  intro: string;
  labels: Record<Exclude<ContactField, 'referrer'>, string>;
  systemLabels: Record<Exclude<ContactField, 'referrer'>, string>;
  placeholders: {
    name: string;
    email: string;
    message: string;
  };
  options: {
    emptyService: string;
  };
  preselectedService: (service: string) => string;
  submit: string;
  pending: string;
  pendingLabel: string;
  success: string;
  failure: string;
  networkFailure: string;
  trustNote: string;
  privacyHref: string;
  privacyLabel: string;
  required: string;
}>;

export function ContactForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const searchParams = useSearchParams();
  const requestedService = getContactServiceOption(searchParams.get('service'), locale);
  const formId = useId();
  const [preselectedService] = useState(requestedService);
  const [values, setValues] = useState<FormState>(() => ({
    ...initialState,
    service: requestedService ?? '',
  }));
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const fieldRefs = useRef<Partial<Record<RequiredContactField, HTMLElement | null>>>({});

  function updateField(field: ContactField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!isRequiredContactField(field) || !current[field]) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function focusFirstError(fieldErrors: ContactFieldErrors) {
    const firstField = (['name', 'email', 'service', 'message'] satisfies RequiredContactField[])
      .find((field) => fieldErrors[field]);

    if (firstField) {
      requestAnimationFrame(() => fieldRefs.current[firstField]?.focus());
    }
  }

  async function parseResponse(response: Response) {
    try {
      return (await response.json()) as {
        ok?: boolean;
        fieldErrors?: ContactFieldErrors;
        error?: string;
      };
    } catch {
      return {};
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage(null);

    const clientErrors = getContactFieldErrors(values, locale);
    if (hasContactFieldErrors(clientErrors)) {
      setErrors(clientErrors);
      focusFirstError(clientErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, locale }),
      });

      const result = await parseResponse(response);

      if (!response.ok) {
        const fieldErrors = result.fieldErrors ?? {};
        setErrors(fieldErrors);
        if (hasContactFieldErrors(fieldErrors)) {
          focusFirstError(fieldErrors);
        }
        setFormMessage({
          tone: 'error',
          text: result.error || t.failure,
        });
        return;
      }

      setValues(initialState);
      setErrors({});
      setFormMessage({
        tone: 'success',
        text: t.success,
      });
    } catch {
      setFormMessage({
        tone: 'error',
        text: t.networkFailure,
      });
    } finally {
      setIsSubmitting(false);
    }
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

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
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
            id={`${formId}-name`}
            label={t.labels.name}
            systemLabel={t.systemLabels.name}
            requiredLabel={t.required}
            value={values.name}
            error={errors.name}
            placeholder={t.placeholders.name}
            required
            autoComplete="name"
            inputRef={(node) => {
              fieldRefs.current.name = node;
            }}
            onChange={(value) => updateField('name', value)}
          />
          <Field
            id={`${formId}-email`}
            label={t.labels.email}
            systemLabel={t.systemLabels.email}
            requiredLabel={t.required}
            type="email"
            value={values.email}
            error={errors.email}
            placeholder={t.placeholders.email}
            required
            autoComplete="email"
            inputMode="email"
            inputRef={(node) => {
              fieldRefs.current.email = node;
            }}
            onChange={(value) => updateField('email', value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {preselectedService && (
            <div className="border border-secondary/30 bg-secondary/10 px-4 py-3 text-xs font-mono text-secondary">
              {t.preselectedService(preselectedService)}
            </div>
          )}
          <SelectField
            id={`${formId}-service`}
            label={t.labels.service}
            systemLabel={t.systemLabels.service}
            requiredLabel={t.required}
            value={values.service}
            error={errors.service}
            emptyOption={t.options.emptyService}
            options={contactServiceOptions[locale]}
            required
            selectRef={(node) => {
              fieldRefs.current.service = node;
            }}
            onChange={(value) => updateField('service', value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            id={`${formId}-company`}
            label={t.labels.company}
            systemLabel={t.systemLabels.company}
            requiredLabel={t.required}
            value={values.company}
            autoComplete="organization"
            onChange={(value) => updateField('company', value)}
          />
          <Field
            id={`${formId}-phone`}
            label={t.labels.phone}
            systemLabel={t.systemLabels.phone}
            requiredLabel={t.required}
            value={values.phone}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            onChange={(value) => updateField('phone', value)}
          />
        </div>

        <TextAreaField
          id={`${formId}-message`}
          label={t.labels.message}
          systemLabel={t.systemLabels.message}
          requiredLabel={t.required}
          value={values.message}
          error={errors.message}
          placeholder={t.placeholders.message}
          required
          textAreaRef={(node) => {
            fieldRefs.current.message = node;
          }}
          onChange={(value) => updateField('message', value)}
        />

        {formMessage && (
          <div
            aria-live="polite"
            role={formMessage.tone === 'success' ? 'status' : 'alert'}
            className={`flex items-center gap-3 border px-4 py-3 text-sm font-mono ${statusToneClass}`}
          >
            {formMessage.tone === 'success' ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{formMessage.text}</span>
          </div>
        )}

        <p className="border border-outline-variant/20 bg-surface-container px-4 py-3 text-xs font-mono leading-relaxed text-on-surface-variant">
          {t.trustNote}{' '}
          <Link href={t.privacyHref} className="text-secondary hover:text-primary transition-colors">
            {t.privacyLabel}
          </Link>
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="cta-primary w-full flex text-sm px-8 py-4 gap-3 mt-8"
        >
          <Send className="w-4 h-4" />
          {isSubmitting && <span className="sr-only" role="status">{t.pendingLabel}</span>}
          {isSubmitting ? t.pending : t.submit}
        </button>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  systemLabel,
  requiredLabel,
  value,
  error,
  placeholder,
  onChange,
  inputRef,
  type = 'text',
  required = false,
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  systemLabel: string;
  requiredLabel: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  inputRef?: (node: HTMLInputElement | null) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: 'email' | 'tel' | 'text';
}) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block">
        <span className="block text-sm text-on-surface">{label} {required && <span className="text-primary">*</span>}</span>
        <span className="font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">
          {systemLabel}{required && ` / ${requiredLabel}`}
        </span>
      </label>
      <input
        id={id}
        ref={inputRef}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full bg-surface-container border px-4 py-3 font-mono text-sm text-on-surface focus:outline-none transition-colors ${error ? 'border-error/40 focus:border-error' : 'border-outline-variant/30 focus:border-primary'}`}
      />
      {error && <p id={errorId} className="text-xs text-error font-mono">{error}</p>}
    </div>
  );
}

function SelectField({
  id,
  label,
  systemLabel,
  requiredLabel,
  value,
  error,
  emptyOption,
  options,
  onChange,
  selectRef,
  required = false,
}: {
  id: string;
  label: string;
  systemLabel: string;
  requiredLabel: string;
  value: string;
  error?: string;
  emptyOption: string;
  options: string[];
  onChange: (value: string) => void;
  selectRef?: (node: HTMLSelectElement | null) => void;
  required?: boolean;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block">
        <span className="block text-sm text-on-surface">{label} {required && <span className="text-primary">*</span>}</span>
        <span className="font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">
          {systemLabel}{required && ` / ${requiredLabel}`}
        </span>
      </label>
      <select
        id={id}
        ref={selectRef}
        value={value}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full bg-surface-container border px-4 py-3 font-mono text-sm text-on-surface focus:outline-none transition-colors appearance-none ${error ? 'border-error/40 focus:border-error' : 'border-outline-variant/30 focus:border-primary'}`}
      >
        <option value="">{emptyOption}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p id={errorId} className="text-xs text-error font-mono">{error}</p>}
    </div>
  );
}

function TextAreaField({
  id,
  label,
  systemLabel,
  requiredLabel,
  value,
  error,
  placeholder,
  onChange,
  textAreaRef,
  required = false,
}: {
  id: string;
  label: string;
  systemLabel: string;
  requiredLabel: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  textAreaRef?: (node: HTMLTextAreaElement | null) => void;
  required?: boolean;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block">
        <span className="block text-sm text-on-surface">{label} {required && <span className="text-primary">*</span>}</span>
        <span className="font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">
          {systemLabel}{required && ` / ${requiredLabel}`}
        </span>
      </label>
      <textarea
        id={id}
        ref={textAreaRef}
        rows={6}
        value={value}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full bg-surface-container border px-4 py-3 font-mono text-sm text-on-surface focus:outline-none transition-colors resize-none ${error ? 'border-error/40 focus:border-error' : 'border-outline-variant/30 focus:border-primary'}`}
      />
      {error && <p id={errorId} className="text-xs text-error font-mono">{error}</p>}
    </div>
  );
}
