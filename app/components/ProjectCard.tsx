// app/components/ProjectCard.tsx
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

type Project = {
  id: number;
  title: string;
  description: string;
  link: string;
  image: string;
  createdAt: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-gray-800 rounded overflow-hidden shadow-lg">
      <Image
        src={project.image}
        alt={project.title}
        width={600}
        height={400}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
        <p className="text-gray-300 mb-5">{project.description}</p>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-custom-green hover:text-green-400"
        >
          View Project <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2" />
        </a>
      </div>
    </div>
  );
}
