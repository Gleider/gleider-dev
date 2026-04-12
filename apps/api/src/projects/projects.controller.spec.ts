import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

const mockProjects = [
  {
    id: '1',
    name: 'gleider.dev',
    slug: 'gleider-dev',
    description: 'Site pessoal',
    type: 'INTERNAL',
    url: null,
    imageUrl: null,
    tags: ['pessoal', 'portfolio'],
    techStack: ['Next.js', 'NestJS'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'API Gateway',
    slug: 'api-gateway',
    description: 'API Gateway centralizado',
    type: 'EXTERNAL',
    url: 'https://gateway.gleider.dev',
    imageUrl: null,
    tags: ['api', 'gateway'],
    techStack: ['Go', 'Redis'],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockProjects),
            findBySlug: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /projects', () => {
    it('should return a list of projects with expected fields', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(mockProjects);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('slug');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('type');
      expect(result[0]).toHaveProperty('tags');
      expect(result[0]).toHaveProperty('techStack');
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /projects/:slug', () => {
    it('should return a specific project by slug', async () => {
      const project = mockProjects[0];
      (service.findBySlug as jest.Mock).mockResolvedValue(project);

      const result = await controller.findBySlug('gleider-dev');

      expect(result).toEqual(project);
      expect(result.slug).toBe('gleider-dev');
      expect(service.findBySlug).toHaveBeenCalledWith('gleider-dev');
    });

    it('should throw NotFoundException for non-existent slug', async () => {
      (service.findBySlug as jest.Mock).mockRejectedValue(
        new NotFoundException('Project with slug "non-existent" not found'),
      );

      await expect(controller.findBySlug('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findBySlug).toHaveBeenCalledWith('non-existent');
    });
  });
});
