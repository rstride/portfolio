// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Optional: Clear existing projects
  await prisma.project.deleteMany();

  await prisma.project.createMany({
    data: [
      {
        title: 'rstride CTF Platform',
        description: 'An engaging Capture The Flag platform designed to enhance cybersecurity skills through practical challenges.',
        link: 'https://ctf.rstride.fr',
        image: '/images/projects/ctf-platform.jpg',
      },
      {
        title: 'rstride Portfolio',
        description: 'My personal portfolio showcasing projects, skills, and achievements in cybersecurity and development.',
        link: 'https://rstride.fr', // Replace with your actual portfolio URL or GitHub repo
        image: '/images/projects/portfolio.jpg',
      },
      {
        title: '42 Cybersecurity Challenge Solver',
        description: 'Solutions to various cybersecurity challenges as part of the 42 Cybersecurity Mastery program.',
        link: 'https://github.com/yourusername/42-cybersecurity-solutions', // Replace with your actual GitHub repo
        image: '/images/projects/cybersecurity-challenges.jpg',
      },
      {
        title: 'Reverse Engineering Toolkit',
        description: 'A comprehensive toolkit for reverse engineering binaries, enhancing analysis and debugging capabilities.',
        link: 'https://github.com/yourusername/reverse-engineering-toolkit', // Replace with your actual GitHub repo
        image: '/images/projects/reverse-engineering-toolkit.jpg',
      },
      // Add more projects as needed
    ],
  });

  console.log('✅ Projects have been seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
