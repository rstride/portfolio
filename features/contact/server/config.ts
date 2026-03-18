export type SmtpConfig = {
  host?: string;
  port: number;
  user?: string;
  pass?: string;
  secure: boolean;
  from?: string;
  to?: string;
};

export function getSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587", 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.EMAIL_RSTRIDE;
  const pass =
    process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_RSTRIDE_PASS;
  const secure = (process.env.SMTP_SECURE || "false") === "true";
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || user;
  const to = process.env.CONTACT_EMAIL || process.env.EMAIL_TO || process.env.EMAIL_RSTRIDE_TO || user;

  return { host, port, user, pass, secure, from, to };
}
