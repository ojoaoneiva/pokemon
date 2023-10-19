import { Body, Controller, Get, Param, Post, Put, ParseIntPipe, Delete, UseGuards, Req } from "@nestjs/common";
import { CustomPokemonsService } from "./customPokemons.service";
import { CreatePokemonDto, EditPokemonDto } from "./dtos/createPokemon.dto";
import { JwtAuthGuard } from './jwt/AuthGuard.service';

@Controller('custompokemons')
export class CustomPokemonsController {
    constructor(private customPokemonService: CustomPokemonsService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    getAllCustumPokemons() {
        return this.customPokemonService.getCustomPokemons();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() pokemon: CreatePokemonDto, @Req() request: any) {
        const creatorEmail = request.user.email;
        return this.customPokemonService.create(pokemon, creatorEmail);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: number, @Body() pokemon: EditPokemonDto, @Req() request: any) {
        const editorEmail = request.user.email;
        return this.customPokemonService.update(id, pokemon, editorEmail);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deletePokemon(@Param('id', ParseIntPipe) id: number, @Req() request: any) {
        const editorEmail = request.user.email;
        return this.customPokemonService.delete(id, editorEmail);
    }
}