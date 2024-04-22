import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { Users } from "./entity/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

@Module({
    imports: [
        JwtModule.register({
            secret: String(process.env.JWT_SECRET),
        }),
        TypeOrmModule.forFeature([Users]),
        CloudinaryModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}