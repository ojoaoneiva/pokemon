import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { PokemonsService } from "./pokemons.service";

@Controller('pokemons')
export class PokemonsController {
    constructor (private pokemonsService: PokemonsService) {}

    @Get()
    getAllPokemons(@Query('page') offset: number) {
        return this.pokemonsService.getPokemons(offset);
    }

    @Get(':id')
    async getPokemonById(@Param('id', ParseIntPipe) id: number) {
        const data = await this.pokemonsService.getPokemonById(id);
        return { data };
    }
}
