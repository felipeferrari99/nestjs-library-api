import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { Users } from "./entity/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { UserResolver } from "./resolver/user.resolver";

@Module({
    imports: [
        JwtModule.register({
            secret: String(process.env.JWT_SECRET),
        }),
        TypeOrmModule.forFeature([Users]),
        CloudinaryModule
    ],
    providers: [UserService, UserResolver],
    exports: [UserService]
})
export class UserModule {}