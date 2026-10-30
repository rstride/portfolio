---
title: "KFS — Kernel From Scratch"
order: 3
summary: "Building a Unix-like x86 kernel in Rust and assembly, from the first boot to isolated user processes and a persistent ext2 filesystem."
role: "Kernel developer · École 42"
period: "École 42 · KFS 1–6"
tags: ["X86", "RUST", "ASSEMBLY", "MEMORY MANAGEMENT", "EXT2", "QEMU"]
externalUrl: "https://github.com/rstride/kfs"
externalLabel: "View source on GitHub"
coverImage: "/projects/kfs-kernel.webp"
coverFit: "contain"
coverAlt: "KFS architecture illustration: boot, Rust kernel, isolated user processes, and ext2 storage"
ogImage: "/projects/kfs-og.png"
seoTitle: "KFS: Rust x86 Kernel From Scratch | Romain Stride"
seoDescription: "Building an educational x86 kernel at École 42: Rust and assembly, paging, interrupts, ring-3 processes, ext2 storage, and QEMU integration tests."
updated: "2026-10-30"
published: true
---

## The challenge

What does an application depend on before its first instruction can run? KFS explores that question by building the underlying system: boot code, memory management, interrupts, process isolation, and disk access.

Developed as part of École 42’s **Kernel From Scratch** curriculum, this educational Unix-like kernel targets 32-bit x86. Rust implements the kernel logic, while assembly handles bootstrapping and CPU transitions. It runs without a host runtime or standard library.

## My work

My work spans six independently buildable milestones, connecting low-level hardware mechanisms to increasingly useful kernel services:

1. **Boot and output:** a Multiboot entry point, custom linker script, GRUB loading, and VGA text output.
2. **Segmentation and interaction:** a Global Descriptor Table, keyboard input, and an interactive shell.
3. **Memory:** 4 KiB paging, physical and virtual allocators, Rust heap support, and fault diagnostics.
4. **Interrupts:** an Interrupt Descriptor Table, PIC/PIT configuration, keyboard IRQs, and deferred kernel callbacks.
5. **Processes:** ring-3 execution, private address spaces, timer preemption, fork/wait/exit, signals, and local socket pairs.
6. **Persistence:** PCI IDE disk access, writable ext2, filesystem commands, and independent process working directories.

## Memory and privilege boundaries

Paging separates user mappings from supervisor-only kernel memory. Each user process owns its address space and kernel stack. Switching processes restores a saved CPU frame and selects the corresponding page directory.

The process interface validates user pointers and complete buffer ranges before accessing them. Fork copies user mappings; exit and reaping reclaim their resources. Failed allocations must unwind without leaking frames or leaving partially constructed processes.

Rust helps structure these ownership rules, while raw memory access, port I/O, and CPU state transitions still require explicit low-level reasoning.

## From volatile state to persistent files

The sixth milestone connects a PCI IDE driver to an ext2 implementation. Files, directories, hard links, symbolic links, and permissions become accessible through the shell, with data retained across boots.

Filesystem mutations stage changed blocks before synchronous writes and a drive flush. The implementation checks filesystem geometry, directory records, and block pointers before use. Ext2 has no journal here, so interrupted multi-block writes can still leave inconsistent metadata.

## Testing the running kernel

The repository includes integration tests that boot the actual kernel under **QEMU**. They exercise memory exhaustion and rollback, hardware faults, process preemption, privilege checks, signals, and filesystem operations.

Filesystem checks also inspect guest-written images with host tools such as `e2fsck` and `debugfs`, then boot again to verify persistence. The [milestone documentation](https://github.com/rstride/kfs/blob/main/kfs_6/README.md) describes the checks and build commands.

## What this project demonstrates

- Understanding the mechanisms behind application execution and isolation.
- Connecting Rust abstractions to hardware constraints and assembly interfaces.
- Reasoning about ownership, cleanup, and failure paths across kernel subsystems.
- Making low-level behavior observable through diagnostics and executable integration tests.

KFS is an educational kernel with a deliberately bounded feature set. The [source repository](https://github.com/rstride/kfs) documents each milestone, its interfaces, and its current limits.
