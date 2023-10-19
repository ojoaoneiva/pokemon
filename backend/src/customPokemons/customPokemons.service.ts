import { Injectable } from "@nestjs/common";
import { CreatePokemonDto, EditPokemonDto } from "./dtos/createPokemon.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Pokemon } from "./entities/Pokemon.entity";
import { BadRequestError } from "../erros/BadRequestError";
import { NotFoundError } from "../erros/NotFoundError";
import { UnauthorizedError } from "src/erros/UnauthorizedError";
import { ForbiddenError } from "src/erros/ForbiddenError";

@Injectable()
export class CustomPokemonsService {
    constructor(
        @InjectRepository(Pokemon)
        private pokemons: Repository<Pokemon>,
    ) { }

    async getCustomPokemons(): Promise<Pokemon[]> {
        return this.pokemons.find();
    }

    async create(pokemon: CreatePokemonDto, creatorEmail: string): Promise<Pokemon> {
        if (!pokemon.name || !pokemon.height || !pokemon.weight) {
            throw new BadRequestError('name, height e weight são campos obrigatórios');
        }
        if (
            typeof pokemon.height !== 'number' ||
            typeof pokemon.weight !== 'number'
        ) {
            throw new BadRequestError('height e weight devem ser numbers');
        }
        if (typeof pokemon.name !== 'string') {
            throw new BadRequestError('name deve ser string');
        }

        if (!creatorEmail) {
            throw new UnauthorizedError('O Token não foi enviado na requisição ou é inválido');
        }

        const newPokemon = this.pokemons.create({
            ...pokemon,
            createdBy: creatorEmail,
        });

        await this.pokemons.save(newPokemon);
        return newPokemon;
    }

    async update(id: number, updatedPokemon: EditPokemonDto, editorEmail: string): Promise<Pokemon> {
        const pokemon = await this.pokemons.findOne({ where: { id } });
        if (!pokemon) {
            throw new NotFoundError(`Não foi encontrado o Pokemon com id = ${id}`);
        }
        if (!editorEmail) {
            throw new UnauthorizedError('O Token não foi enviado na requisição ou é inválido');
        }
        if (editorEmail !== pokemon.createdBy) {
            throw new ForbiddenError('Token válido, mas somente quem criou este Pokemon pode editá-lo');
        }
        if (
            typeof pokemon.id !== 'number' ||
            typeof pokemon.height !== 'number' ||
            typeof pokemon.weight !== 'number'
        ) {
            throw new BadRequestError('Id, height e weight devem ser numbers');
        }
        if (typeof pokemon.name !== 'string') {
            throw new BadRequestError('name deve ser string');
        }

        if (updatedPokemon.name) {
            pokemon.name = updatedPokemon.name;
        }
        if (updatedPokemon.height) {
            pokemon.height = updatedPokemon.height;
        }
        if (updatedPokemon.weight) {
            pokemon.weight = updatedPokemon.weight;
        }

        return this.pokemons.save(pokemon);
    }

    async delete(id: number, editorEmail: string): Promise<void> {
        const pokemon = await this.pokemons.findOne({ where: { id } });
        if (!pokemon) {
            throw new NotFoundError(`Não foi encontrado o Pokemon com id = ${id}`);
        }
        if (!editorEmail) {
            throw new UnauthorizedError('O Token não foi enviado na requisição ou é inválido');
        }
        if (editorEmail !== pokemon.createdBy) {
            throw new ForbiddenError('Token válido, mas somente quem criou este Pokemon pode excluí-lo');
        }
        await this.pokemons.remove(pokemon);
    }
}
