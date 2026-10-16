---
id: HTB-2025-002
title: Expressway
excerpt: "Expressway teaches three separate failures: a guessable IKEv1 pre-shared key, reuse of that key for SSH, and sudo behavior that allows local elevation under specific configurations."
date: '2025-09-20'
updated: "2026-10-15"
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - EASY
  - VPN
  - IPSEC
  - IKE
  - PRIVESC
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: EASY
severity: HIGH
icon: Terminal
author: '0x7CC'
---

## Start with the right protocols

The lab route is **IKE Aggressive Mode → offline PSK recovery → SSH as `ike` → sudo host-policy bypass or vulnerable chroot path → root**. The VPN secret is not automatically an SSH credential; reuse is a separate weakness. Likewise, a vulnerable sudo version alone does not tell which local path is available. Two CVEs appear in public solutions, with different prerequisites.

`expressway.htb` refers to the lab host. `<LAB_IP>` is its address and `<LAB_PSK>` is the recovered secret; neither is a literal value. The commands here are diagnostics within an authorized machine, and no secret or flag is reproduced.

## Confirm the UDP service

A TCP scan shows SSH. The interesting service is UDP 500, with 4500 also involved in IPsec NAT traversal. UDP 69 may appear in targeted enumeration, but its presence does not itself provide a configuration file. Unlike TCP, an unanswered UDP probe often yields `open|filtered`, which is ambiguous. Use a protocol-aware IKE probe to confirm the VPN service instead of treating silence as proof. The [Nmap UDP guide](https://nmap.org/book/scan-methods-udp-scan.html) explains this limitation.

A targeted diagnostic from the workstation is:

```bash
sudo nmap -sU -sV -p 500,4500,69 expressway.htb
ike-scan -A expressway.htb
```

`-sU` chooses UDP and `-sV` asks Nmap to identify the service. `ike-scan -A` requests IKEv1 Aggressive Mode. Record the responder's proposal, identity, and authentication type. A returned identity such as `ike@expressway.htb` is an IKE identity, not proof of a Unix account; it does provide a lead for later checking.

## Why Aggressive Mode permits an offline guess

In IKEv1 Aggressive Mode, key-exchange material and an authentication value are available from the handshake. With PSK authentication, a tester can evaluate guesses of the shared secret against that captured exchange without repeatedly logging into the VPN. [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.html) specifies the exchange. The attacker still needs a complete, correctly formatted capture and a weak enough secret for guessing to succeed. A proposed hash alone does not reveal the PSK.

A disciplined replay saves the handshake in the format expected by the chosen offline tool, checks the identity and transform, and tests candidates locally. Record tool version and format rather than copying a guessed cracking mode. If no response comes back, investigate UDP filtering, target address, IKE version, proposals, and whether Aggressive Mode is enabled. A failed guess is not evidence that the service is patched; it may simply use a strong PSK.

The laboratory password recovered from this exchange also authenticates `ike` over SSH. Test that claim separately. SSH success and `id` establish the local OS account; the IKE handshake never grants the shell by itself. Rotating only the VPN PSK would leave risk if the same password remained valid for SSH.

## Distinguish the two sudo paths

After SSH access, inventory the available sudo binaries and policies:

```bash
command -v sudo
/usr/bin/sudo --version
/usr/local/bin/sudo --version
ls -l /usr/bin/sudo /usr/local/bin/sudo
sudo -l
```

Do not assume both paths exist in every build. `command -v` shows what the shell would execute by default, while the explicit version and permissions checks identify separate copies. A distribution package update may fix `/usr/bin/sudo` without changing a custom SUID copy in `/usr/local/bin`.

The lab's direct path involves CVE-2025-32462: a hostname supplied with sudo's `-h` option can be used improperly in host-based sudoers matching. A hostname such as `offramp.expressway.htb` is discoverable from a Squid access log on the machine. An authorized user should compare `sudo -l` for the real host and that named host before trying a command. The key condition is a sudoers rule whose host component grants a command under the alternate name. A random hostname or an affected version without such a rule is insufficient. The demonstration should show which sudo binary was called, which hostname matched, and the resulting effective identity. The [sudo project advisory](https://www.sudo.ws/security/advisories/host_any/) explains the host-policy issue.

A separate route uses CVE-2025-32463. In affected upstream sudo builds, a chroot option can cause sudo to load attacker-controlled NSS configuration and code before policy enforcement. It does not depend on a permissive sudoers command rule, but it does require a vulnerable executable, SUID operation, appropriate filesystem setup, and a working payload for that build. The [original disclosure](https://www.stratascale.com/resource/cve-2025-32463-sudo-chroot-elevation-of-privilege/) describes affected releases and the fix. A version string alone cannot exclude distribution backports. The two CVEs should not be described as one technique; record which path actually produced root.

## Troubleshoot and repair

If the alternate hostname does not work, inspect the actual sudoers host aliases, confirm the log's hostname is relevant, and check whether `-h` is interpreted by the selected sudo binary as expected. A name-resolution warning does not by itself mean the policy check failed. If the chroot path fails, verify exact binary provenance, fix level, architecture, and exploit prerequisites. If SSH rejects the PSK, test whether the secret was recovered correctly and whether reuse is present rather than assuming the VPN and SSH accounts are linked.

Disable IKEv1 Aggressive Mode where possible, use long independent VPN secrets or certificate-based authentication, and rotate any recovered PSK and reused SSH password. Patch every privileged sudo copy or remove unsupported custom builds. Audit host-specific sudoers rules and restrict any unnecessary `ALL` grants. A retest should reject the old VPN secret and SSH password, preserve approved VPN access, deny alternate-host sudo authorization, and show a fixed sudo executable at every SUID path. Monitor unexpected IKE handshakes, SSH access by VPN identities, and sudo commands selecting unusual hostnames or chroot roots. Offline PSK guessing itself will not produce repeated online login failures.
