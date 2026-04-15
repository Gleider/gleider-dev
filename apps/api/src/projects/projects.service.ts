import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }

    return project;
  }

  async create(dto: CreateProjectDto) {
    try {
      return await this.prisma.project.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          type: dto.type,
          url: dto.url,
          imageUrl: dto.imageUrl,
          tags: dto.tags ?? [],
          techStack: dto.techStack ?? [],
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Project with slug "${dto.slug}" already exists`);
      }
      throw error;
    }
  }

  async update(slug: string, dto: UpdateProjectDto) {
    try {
      return await this.prisma.project.update({
        where: { slug },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Project with slug "${slug}" not found`);
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Project with slug "${dto.slug}" already exists`);
      }
      throw error;
    }
  }

  async remove(slug: string) {
    try {
      return await this.prisma.project.delete({
        where: { slug },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Project with slug "${slug}" not found`);
      }
      throw error;
    }
  }
}
