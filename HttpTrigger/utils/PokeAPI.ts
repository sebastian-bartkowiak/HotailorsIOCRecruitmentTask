import { inject, injectable } from "inversify";
import { COMMON_TYPES } from "../../ioc/commonTypes";
import { ILogger } from "../../commonServices/iLogger";
import _ from "lodash";

import { IPokeAPI } from "./IPokeAPI";
import { IPokeDetails } from "./IPokeDetails";
import { IResponse } from "./IResponse";

import axios from "axios";
import { AxiosResponse } from "axios";

interface IPokemonGroup {
    type: string;
    pokemons: IPokeDetails[];
}

@injectable()
export class PokeAPI implements IPokeAPI {

    private _cachedTypes: string[];

    private readonly _cachedPokemons: IPokemonGroup[] = [];

    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;

    public async getPokemonTypes(): Promise<string[]> {
        if (this._cachedTypes === undefined) {
            this._logger.verbose("Querying valid Pokemon types from PokeAPI");
            try {
                const rawTypes: AxiosResponse = await axios.get("https://pokeapi.co/api/v2/type/");
                if (rawTypes.status === 200) {
                    this._cachedTypes = _.map(
                        rawTypes.data.results,
                        (typeDefinition: any) => typeDefinition.name,
                    );
                }
            } catch (error) {
                this._logger.error("Error occured while querying PokeAPI!");
                const pokeAPIError: IResponse = {
                    body: {
                        error: "Error occured while querying PokeAPI",
                    },
                    status: 500,
                };
                throw pokeAPIError;
            }
            this._logger.verbose(`Succesfully queried ${this._cachedTypes.length} Pokemon types from PokeAPI`);
        }

        return this._cachedTypes;
    }

    public async getPokemonsByType(type: string): Promise<IPokeDetails[]> {
        for (const pokeGroup of this._cachedPokemons) {
            if (pokeGroup.type === type) {
                return pokeGroup.pokemons;
            }
        }

        this._logger.verbose(`Querying valid Pokemons for type "${type}" from PokeAPI`);
        const newPokemonsGroup: IPokemonGroup = {
            type,
            pokemons: [],
        };
        try {
            const rawPokemons: AxiosResponse = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
            if (rawPokemons.status === 200) {
                newPokemonsGroup.pokemons = _.map(
                    rawPokemons.data.pokemon,
                    (rawPokemonDefinition: any) => {
                        const parsedPokemonDefinition: IPokeDetails = {
                            id: this._extractIdFromUrl(rawPokemonDefinition.pokemon.url),
                            name: rawPokemonDefinition.pokemon.name,
                        };
                        return parsedPokemonDefinition;
                    },
                );
            }
        } catch (error) {
            this._logger.error("Error occured while querying PokeAPI!");
            const pokeAPIError: IResponse = {
                body: {
                    error: "Error occured while querying PokeAPI",
                },
                status: 500,
            };
            throw pokeAPIError;
        }
        this._cachedPokemons.push(newPokemonsGroup);
        this._logger.verbose(`Succesfully queried ${newPokemonsGroup.pokemons.length} Pokemons for type "${type}" from PokeAPI`);
        return newPokemonsGroup.pokemons;
    }

    private _extractIdFromUrl(url: string): number {
        const potentialId: string = _.nth(_.split(url, "/"), -2);
        const parsedId: number = _.toInteger(potentialId);
        if (!_.isNaN(parsedId) && _.toString(parsedId) === potentialId) {
            return parsedId;
        }
        throw TypeError;
    }
}
