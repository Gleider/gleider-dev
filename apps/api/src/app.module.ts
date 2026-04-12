import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { ExperienceModule } from './experience/experience.module';

@Module({
  imports: [PrismaModule, ProjectsModule, ExperienceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
