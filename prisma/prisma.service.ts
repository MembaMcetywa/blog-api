/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly client = new PrismaClient();

  public connect = (): Promise<void> => this.client.$connect();
  public disconnect = (): Promise<void> => this.client.$disconnect();

  public onModuleInit = (): Promise<void> => this.connect();
  public onModuleDestroy = (): Promise<void> => this.disconnect();

  public get prisma(): PrismaClient {
    return this.client;
  }
}
