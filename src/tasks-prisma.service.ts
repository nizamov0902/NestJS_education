import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { prisma, Prisma, task, user } from '@prisma/client';
import { TaskStatus } from './tasks/task.status.enum';
import { CreateTaskDto } from './tasks/dto/create-task.dto';
import { GetTasksFilterDto } from './tasks/dto/get-tasks-filter.dto';

@Injectable()
export class TasksPrismaService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: CreateTaskDto, user: user): Promise<task> {
    const { title, description } = data;

    const userTasks = await this.prisma.task.create({
      data: {
        title,
        description,
        status: TaskStatus.OPEN,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return userTasks;
  }

  async getTasks(data: GetTasksFilterDto, user: user): Promise<task[]> {
    const { status, search } = data;

    const result = this.prisma.task.findMany({
      where: {
        AND: [
          {
            userId: user.id,
          },
          {
            status: status,
          },
          {
            OR: [
              {
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
    });
    return result;
  }
}
