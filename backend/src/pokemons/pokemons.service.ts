import { Injectable } from "@nestjs/common";
import axios from 'axios';

@Injectable()
export class PokemonsService {
    async getPokemons(offset: number){

        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${10}`);
            return response.data.results;
        } catch (error) {
            throw new Error('Erro ao buscar dados da API externa');
        }
    }

    async getPokemonById(id: number){
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar dados da API externa');
        }
    }
}
