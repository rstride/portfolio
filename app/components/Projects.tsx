// app/components/Projects.tsx
'use client';
import { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';

type Project = {
  id: number;
  title: string;
  description: string;
  link: string;
  image: string;
  createdAt: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch projects.');
        }
        setProjects(data);
      } catch (err: unknown) { // Changed from 'any' to 'unknown'
        console.error('Error fetching projects:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-5">
          <h2 className="text-4xl font-bold mb-8 text-center">Projects</h2>
          <p className="text-center">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-5">
          <h2 className="text-4xl font-bold mb-8 text-center">Projects</h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-5">
        <h2 className="text-4xl font-bold mb-8 text-center">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
