import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authors } from './author/entity/author.entity';
import { Users } from './user/entity/user.entity';
import { Books } from './book/entity/book.entity';
import { UserModule } from './user/user.module';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { Comments } from './comment/entity/comment.entity';
import { CommentModule } from './comment/comment.module';
import { Rents } from './rent/entity/rent.entity';
import { RentsModule } from './rent/rent.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
      ConfigModule.forRoot({
        envFilePath: '.env',
      }),

      UserModule,
      AuthorModule,
      BookModule,
      CommentModule,
      RentsModule,
      CloudinaryModule,

      TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Authors, Books, Users, Comments, Rents],
      synchronize: true
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
