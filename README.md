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
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application

# Email de destination pour les messages de contact
CONTACT_EMAIL=votre-email@domaine.com
```

### 3. Configuration pour différents fournisseurs

#### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
```

**Important :** Pour Gmail, vous devez utiliser un "mot de passe d'application" au lieu de votre mot de passe normal.
1. Allez dans les paramètres de sécurité de votre compte Google
2. Activez la "Vérification en deux étapes"
3. Générez un "mot de passe d'application" dans la section "Mots de passe d'application"

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