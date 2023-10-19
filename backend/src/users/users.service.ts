import { Injectable, NotFoundException } from "@nestjs/common";
import { UserDto, UserOutputDto } from "./dtos/user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/User.entity";
import { BadRequestError } from "src/erros/BadRequestError";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv-safe'

dotenv.config()

@Injectable()
export class UsersService {
    private secretKey: string;
    
    constructor(
        @InjectRepository(User)
        private users: Repository<User>,
    ) {
        this.secretKey = process.env.JWT_KEY;
    }

    async getUsers(): Promise<User[]> {
        return this.users.find();
    }

    async login(user: UserDto): Promise<UserOutputDto> {
        if (!user.email || !user.password) {
            throw new BadRequestError('Email e senha são campos obrigatórios');
        }
        const existingUser = await this.users.findOne({ where: { email: user.email } });
        if (!existingUser) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        if (existingUser.password !== user.password) {
            throw new BadRequestError('Senha incorreta.');
        }

        const token = this.generateJwtToken(existingUser);
        return { message: 'Login concluído com sucesso. Bem-vindo, ' + existingUser.name + '!', token };
    }

    async signUp(user: UserDto): Promise<UserOutputDto> {
        if (!user.email || !user.name || !user.password) {
            throw new BadRequestError('Email, nome e senha são campos obrigatórios');
        }
        if (typeof user.email !== 'string' || typeof user.name !== 'string' || typeof user.password !== 'string') {
            throw new BadRequestError('Nome e senha devem ser strings');
        }
        if (!this.isValidEmail(user.email)) {
            throw new BadRequestError('Email inválido');
        }

        const newUser = this.users.create(user);
        await this.users.save(newUser);

        const token = this.generateJwtToken(newUser);
        return { message: 'Conta criada com sucesso. Bem-vindo, ' + newUser.name + '!', token };
    }

    private generateJwtToken(user: UserDto): string {
        const payload = { email: user.email };
        return jwt.sign(payload, this.secretKey);
    }
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}