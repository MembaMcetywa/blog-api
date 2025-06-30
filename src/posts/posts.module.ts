import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [UsersModule],
  controllers: [PostsController],
  providers: [PostsService, UsersService]
})
export class PostsModule {}
