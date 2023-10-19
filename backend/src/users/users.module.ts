import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/User.entity";
import { LoginController, SignUpController, UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    controllers: [LoginController, SignUpController, UsersController],
})
export class UsersModule{}