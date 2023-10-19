import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDto } from "./dtos/user.dto";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }
    @Get()
    getAllUsers() {
        return this.usersService.getUsers()
    }
}

@Controller('login')
export class LoginController {
    constructor(private usersService: UsersService) { }
    @Post()
    loginUser(@Body() user: UserDto) {
        return this.usersService.login(user)
    }
}

@Controller('signup')
export class SignUpController {
    constructor(private usersService: UsersService) { }
    @Post()
    createUser(@Body() user: UserDto) {
        return this.usersService.signUp(user)
    }
}