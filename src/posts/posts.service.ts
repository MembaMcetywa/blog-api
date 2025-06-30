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
        tags: data.tags?.length
          ? {
              connectOrCreate: data.tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { author: true, tags: true },
    });
  }

  findAllByTags(tagList: string[]) {
    if (!tagList.length) {
      return this.prisma.post.findMany({
        include: { author: true, tags: true },
      });
    }
    return this.prisma.post.findMany({
      where: {
        tags: {
          some: { name: { in: tagList } },
        },
      },
      include: { author: true, tags: true },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: true, tags: true },
    });
  }

  async update(id: number, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Post ${id} not found`);

    const { tags, ...rest } = dto;
    return this.prisma.post.update({
      where: { id },
      data: {
        ...rest,
        ...(tags
          ? {
              tags: {
                set: [],
                connectOrCreate: tags.map((name) => ({
                  where: { name },
                  create: { name },
                })),
              },
            }
          : {}),
      },
      include: { author: true, tags: true },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.post.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return this.prisma.post.delete({ where: { id } });
  }
}
