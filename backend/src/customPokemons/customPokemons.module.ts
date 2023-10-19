import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pokemon } from "./entities/Pokemon.entity";
import { CustomPokemonsService } from "./customPokemons.service";
import { CustomPokemonsController } from "./customPokemons.controller";
import { JwtService } from "./jwt/jwt.service";

@Module({
    imports: [TypeOrmModule.forFeature([Pokemon])],
    providers: [CustomPokemonsService, JwtService],
    controllers: [CustomPokemonsController],
})
export class CustomPokemonsModule {}