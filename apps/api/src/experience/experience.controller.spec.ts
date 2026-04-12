import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';

const mockExperiences = [
  {
    id: '1',
    company: 'TechCorp Brasil',
    role: 'Senior Software Engineer',
    description: 'Liderança técnica de squad',
    startDate: new Date('2023-06-01'),
    endDate: null,
    current: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    company: 'StartupXYZ',
    role: 'Full Stack Developer',
    description: 'Desenvolvimento full stack',
    startDate: new Date('2021-03-01'),
    endDate: new Date('2023-05-31'),
    current: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    company: 'Agência Digital',
    role: 'Junior Developer',
    description: 'Desenvolvimento de aplicações web',
    startDate: new Date('2019-08-01'),
    endDate: new Date('2021-02-28'),
    current: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

describe('ExperienceController', () => {
  let controller: ExperienceController;
  let service: ExperienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperienceController],
      providers: [
        {
          provide: ExperienceService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockExperiences),
          },
        },
      ],
    }).compile();

    controller = module.get<ExperienceController>(ExperienceController);
    service = module.get<ExperienceService>(ExperienceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /experience', () => {
    it('should return a list of experiences ordered by date (most recent first)', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(mockExperiences);
      expect(result).toHaveLength(3);
      expect(service.findAll).toHaveBeenCalled();

      // Verify ordering: most recent startDate first
      for (let i = 0; i < result.length - 1; i++) {
        const currentStart = new Date(result[i].startDate).getTime();
        const nextStart = new Date(result[i + 1].startDate).getTime();
        expect(currentStart).toBeGreaterThanOrEqual(nextStart);
      }
    });

    it('should return current experience first', async () => {
      const result = await controller.findAll();

      expect(result[0].current).toBe(true);
      expect(result[0].endDate).toBeNull();
    });

    it('should return experiences with expected fields', async () => {
      const result = await controller.findAll();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('company');
      expect(result[0]).toHaveProperty('role');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('startDate');
      expect(result[0]).toHaveProperty('endDate');
      expect(result[0]).toHaveProperty('current');
    });
  });
});
