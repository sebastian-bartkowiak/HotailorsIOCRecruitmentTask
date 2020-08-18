import { IPokeDetails } from "./IPokeDetails";

export interface IPokeAPI {
    getPokemonTypes(): Promise<string[]>;
    getPokemonsByType(type: string): Promise<IPokeDetails[]>;
}
