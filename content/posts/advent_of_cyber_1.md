---
title: "TryHackMe Advent Of Cyber : Side quest 1"
date: "2025-12-01"
excerpt: ""
coverImage: "/blog/sq1.png"
---

## Introduction

This article details the complete process used to unlock the hidden **Side Quest** in the TBFC challenge environment. The objective was to trace clues left by the character *mcskidy*, piece together a fragmented passphrase, decrypt multiple protected files, repair a malfunctioning website, and ultimately retrieve the secret phrase granting access to the Side Quest portal.

This write-up is structured to be clear, technically accurate, and optimized for search engines. It includes every command and action required to reproduce the path to the Side Quest.

---

## Step 1 — The Initial Message from mcskidy

The file located at:

```
/home/mcskidy/Documents/read-me-please.txt
```

introduces the situation. mcskidy explains he planted three hidden “easter eggs,” each containing a fragment of a passcode. Once combined, this passcode unlocks an encrypted vault under the user account `eddi_knapp`.

The file also provides credentials:

```
username: eddi_knapp
password: S0mething1Sc0ming
```

And three metaphorical clues directing us to different locations within the system.

---

## Step 2 — Discovering Passphrase Fragment 1

The first clue points toward shell session files. Exploring `.bashrc`, `.profile` and `.pam_environment` reveals a consistent variable:

```
PASSFRAG1="3ast3r"
```

This is the first fragment of the decryption passphrase.

---

## Step 3 — Recovering Passphrase Fragment 2 via Git History

The second clue mentions reading “the ledger’s older pages,” which refers to Git logs. Inside the backup Git repository:

```
~/.secret_git.bak/.git
```

Running:

```
git log
```

reveals a commit that removed a private note. Viewing that commit recovers:

```
PASSFRAG2: -1s-
```

---

## Step 4 — Extracting Passphrase Fragment 3 from a Hidden Image

The final clue points toward images. Inside:

```
~/Pictures/.easter_egg
```

an ASCII-art file contains the final fragment:

```
PASSFRAG3: c0M1nG
```

---

## Step 5 — Reconstructing the Full Passphrase

Combining all fragments in order results in:

```
3ast3r-1s-c0M1nG
```

This is the key used to decrypt mcskidy’s hidden message.

---

## Step 6 — Decrypting mcskidy’s Encrypted Note

Decrypt the file:

```
/home/eddi_knapp/Documents/mcskidy_note.txt.gpg
```

using:

```
gpg --pinentry-mode=loopback --passphrase "3ast3r-1s-c0M1nG" -d mcskidy_note.txt.gpg
```

The decrypted content reveals two crucial elements:

1. A corrected wishlist that must overwrite:

```
/home/socmas/2025/wishlist.txt
```

2. An unlock key for a later decryption step:

```
UNLOCK_KEY: 91J6X7R4FQ9TQPM9JX2Q9X2Z
```

It also explains that fixing the website will cause new encrypted data to appear.

---

## Step 7 — Repairing the Website’s Wishlist

As root, overwrite the wishlist file:

```
bash -c 'cat > /home/socmas/2025/wishlist.txt' << "EOF"
<corrected wishlist content>
EOF
```

Once the file is corrected, revisiting the target website displays a large ciphertext encoded in Base64.

---

## Step 8 — Decrypting the Website Ciphertext

Save the ciphertext to:

```
/tmp/website_output.txt
```

Then decrypt it using the unlock key:

```
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -salt -base64 \
  -in /tmp/website_output.txt \
  -out /tmp/decoded_message.txt \
  -pass pass:"91J6X7R4FQ9TQPM9JX2Q9X2Z"
```

The result contains the following flag:

```
THM{w3lcome_2_A0c_2025}
```

This flag becomes the passphrase for the next protected archive.

---

## Step 9 — Decrypting the Secret Directory Archive

Inside:

```
/home/eddi_knapp/.secret
```

the archive:

```
dir.tar.gz.gpg
```

is decrypted using:

```
gpg --pinentry-mode=loopback --passphrase 'THM{w3lcome_2_A0c_2025}' \
  -o dir.tar.gz -d dir.tar.gz.gpg
```

Then extracted with:

```
tar -xzf dir.tar.gz
```

This produces one file: `sq1.png`.

---

## Step 10 — Retrieving the Side Quest Unlock Phrase

Opening `sq1.png` reveals an illustrated easter egg marked with the number 1 and containing the phrase:

```
now_you_see_me
```

Entering this phrase into the unlocked portal at:

```
http://<machine_ip>:21337/
```

provides access to the Side Quest content and opens additional ports on the machine for further exploration.

---

## Conclusion

Through careful analysis of shell configurations, Git history, hidden files, encrypted archives, and website behavior, the full unlock sequence was reconstructed. The final phrase required to access the Side Quest challenge was recovered from a decrypted image.

**Side Quest Access Phrase:**

```
now_you_see_me
```

This concludes the complete walkthrough for unlocking the Side Quest in the TBFC environment.
