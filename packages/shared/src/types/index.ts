export enum ProjectType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: ProjectType;
  url: string | null;
  imageUrl: string | null;
  tags: string[];
  techStack: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  createdAt: string;
  updatedAt: string;
}
