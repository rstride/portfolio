// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.project.createMany({
    data: [
      {
        title: 'Network Vulnerability Scanner',
        description: 'A tool that scans networks for vulnerabilities using advanced algorithms.',
        link: 'https://github.com/yourusername/network-scanner',
        image: '/images/projects/network-scanner.jpg',
      },
      {
        title: 'Reverse Engineering Challenge',
        description: 'Solved complex reverse engineering problems as part of a cybersecurity competition.',
        link: 'https://github.com/yourusername/reverse-engineering',
        image: '/images/projects/reverse-engineering.jpg',
      },
      // Add more projects as needed
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
