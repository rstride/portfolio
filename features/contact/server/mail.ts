import path from 'node:path';
import { loadEnvConfig } from '@next/env';

export type ContactMailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
  from: string;
  to: string;
};

let envLoaded = false;

function ensureSharedEnvLoaded() {
  if (envLoaded) {
    return;
  }

  loadEnvConfig(process.cwd());
  loadEnvConfig(path.resolve(process.cwd(), '..'));
  envLoaded = true;
}

export function createTransportOptions(config: ContactMailConfig) {
  return {
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  };
}

export function getRstrideMailConfig(): ContactMailConfig {
  ensureSharedEnvLoaded();

  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_RSTRIDE;
  const pass = process.env.EMAIL_RSTRIDE_PASS;
  const from = process.env.EMAIL_RSTRIDE;
  const to = process.env.EMAIL_RSTRIDE;
  const secure = port === 465;

  if (!host || !user || !pass || !from || !to || Number.isNaN(port)) {
    throw new Error('Missing portfolio SMTP configuration');
  }

  return {
    host,
    port,
    user,
    pass,
    secure,
    from,
    to,
  };
}
