import { Module } from "@nestjs/common";
import { PokemonsService } from "./pokemons.service";
import { PokemonsController } from "./pokemons.controller";

@Module({
    imports: [],
    providers: [PokemonsService],
    controllers: [PokemonsController],
})
export class PokemonsModule{}