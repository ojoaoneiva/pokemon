export class CreatePokemonDto {
    id: number;
    name: string;
    height: number;
    weight: number;
    createdBy: string;
}

export class EditPokemonDto {
    name: string;
    height: number;
    weight: number;
}