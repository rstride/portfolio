// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import redisClient from '../../../lib/redis';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Attempt to get projects from Redis cache
    const cachedProjects = await redisClient.get('projects');

    if (cachedProjects) {
      return NextResponse.json(JSON.parse(cachedProjects), { status: 200 });
    }

    // Fetch projects from the database
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Store projects in Redis cache
    await redisClient.set('projects', JSON.stringify(projects), {
      EX: 3600, // Cache expires in 1 hour
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects.' },
      { status: 500 }
    );
  }
}
