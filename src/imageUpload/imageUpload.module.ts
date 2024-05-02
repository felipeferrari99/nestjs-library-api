import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { BookModule } from '../book/book.module';
import { AuthorModule } from '../author/author.module';
import { ImageUploadController } from './imageUpload.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';


@Module({
  imports: [CloudinaryModule, UserModule, BookModule, AuthorModule],
  controllers: [ImageUploadController],
  providers: [],
  exports: []
})
export class ImageUploadModule {}