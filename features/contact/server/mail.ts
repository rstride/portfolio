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

export function resolveContactMailConfig(env: Record<string, string | undefined>): ContactMailConfig {
  const host = env.EMAIL_HOST;
  const port = Number(env.EMAIL_PORT || '587');
  const user = env.EMAIL_RSTRIDE || env.EMAIL_USER;
  const pass = env.EMAIL_RSTRIDE_PASS || env.EMAIL_PASS;
  const from = env.EMAIL_RSTRIDE || env.EMAIL_FROM || user;
  const to = env.EMAIL_RSTRIDE || env.EMAIL_TO || user;
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

export function getRstrideMailConfig(): ContactMailConfig {
  ensureSharedEnvLoaded();
  return resolveContactMailConfig(process.env);
}
