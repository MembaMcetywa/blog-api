import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(data: CreatePostDto) {
    await this.usersService.findOne(data.authorId);

    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published ?? false,
        author: { connect: { id: data.authorId } },
        tags: data.tagIds?.length
          ? { connect: data.tagIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { author: true, tags: true },
    });
  }

  findAll() {
    return this.prisma.post.findMany({
      include: { author: true, tags: true },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: true, tags: true },
    });
  }

  async update(id: number, data: UpdatePostDto) {
    const existing = await this.prisma.post.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return this.prisma.post.update({ where: { id }, data });
  }

  async remove(id: number) {
    const existing = await this.prisma.post.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return this.prisma.post.delete({ where: { id } });
  }
}
