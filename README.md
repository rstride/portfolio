# Portfolio Romain Stride

## Configuration du formulaire de contact

Pour que le formulaire de contact fonctionne correctement, vous devez configurer les variables d'environnement SMTP.

### 1. Créer le fichier .env

Copiez le fichier `.env.example` vers `.env` et remplissez les valeurs :

```bash
cp .env.example .env
```

### 2. Variables d'environnement requises

```env
# Configuration SMTP (obligatoire pour le formulaire de contact)
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@rstride.fr
SMTP_PASS=votre-mot-de-passe-ovh

# Email de destination pour les messages de contact
CONTACT_EMAIL=contact@rstride.fr
```

Le formulaire peut aussi utiliser les variables `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` et `EMAIL_TO`. Si vous utilisez le fichier `Websites/.env` partage entre les deux sites, il accepte aussi `EMAIL_RSTRIDE`, `EMAIL_RSTRIDE_PASS` et `EMAIL_RSTRIDE_TO`.

### 3. Configuration pour différents fournisseurs

#### OVH
```env
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@rstride.fr
SMTP_PASS=votre-mot-de-passe-ovh
CONTACT_EMAIL=contact@rstride.fr
```

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@outlook.com
SMTP_PASS=votre-mot-de-passe
```

#### Serveur SMTP personnalisé
```env
SMTP_HOST=votre-serveur-smtp.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-utilisateur
SMTP_PASS=votre-mot-de-passe
```

### 4. Test du formulaire

Une fois configuré, le formulaire de contact enverra réellement les emails au lieu de faire une simulation.

## Développement local

```bash
npm install
npm run dev
```

## Technologies utilisées

- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion
- NodeMailer
