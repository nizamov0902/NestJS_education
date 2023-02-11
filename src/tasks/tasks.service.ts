import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import { PrismaService } from '../prisma.service';
import { TasksPrismaService } from '../tasks-prisma.service';
import { task } from '@prisma/client';
import { user } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
    private prismaService: PrismaService,
    private tasksPrismaService: TasksPrismaService,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: user): Promise<task[]> {
    return this.tasksPrismaService.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    let found: any;
    // eslint-disable-next-line prefer-const
    found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return found;
  }
  // getTaskById(id: string): Task {
  //    const found = this.tasks.find((task) => task.id === id);
  //
  //    if (!found) {
  //        throw new NotFoundException(`Task with ID ${id} not found`);
  //    }
  //
  //    return found;
  // }
  //
  createTask(createTaskDto: CreateTaskDto, user: user): Promise<task> {
    return this.tasksPrismaService.createTask(createTaskDto, user);
  }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //     const { title, description } = createTaskDto;
  //
  //     const task: Task = {
  //         id: uuid(),
  //         title,
  //         description,
  //         status: TaskStatus.OPEN,
  //     };
  //
  //     this.tasks.push(task);
  //
  //     return task;
  // }
  //
  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  // updateTaskStatus(id: string, status: TaskStatus) {
  //     const task = this.getTaskById(id);
  //     task.status = status;
  //     return task;
  // }

  async deleteTask(id: string, user: User): Promise<void> {
    //.remove() method
    // let found: any;
    // found = await this.tasksRepository.findOne(id);
    //
    // if (!found) {
    //     throw new NotFoundException(`Task with ID ${id} not found`);
    // }
    //
    // await this.tasksRepository.remove(found);

    //.delete() method
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  // deleteTask(id: string): void {
  //     const found = this.getTaskById(id);
  //     this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }
}
