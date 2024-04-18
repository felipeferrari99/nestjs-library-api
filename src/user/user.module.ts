import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { Users } from "./entity/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users])
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}