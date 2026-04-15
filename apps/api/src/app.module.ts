import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ExperienceModule } from './experience/experience.module';

@Module({
  imports: [PrismaModule, AuthModule, ProjectsModule, ExperienceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
