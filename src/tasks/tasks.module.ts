import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { TasksPrismaService } from '../tasks-prisma.service';

@Module({
  imports: [TypeOrmModule.forFeature([TasksRepository]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService, PrismaService, TasksPrismaService],
})
export class TasksModule {}
