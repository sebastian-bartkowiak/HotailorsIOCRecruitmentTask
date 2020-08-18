import { inject, injectable } from "inversify";
import { COMMON_TYPES } from "../../ioc/commonTypes";
import { ILogger } from "../../commonServices/iLogger";
import _ from "lodash";

import { IPokeFinder } from "./IPokeFinder";
import { IPokeQuery } from "./IPokeQuery";
import { IPokeAPI } from "./IPokeAPI";
import { IResponse } from "./IResponse";
import { IPokeDetails } from "./IPokeDetails";

@injectable()
export class PokeFinder implements IPokeFinder {

    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;
    
    @inject(COMMON_TYPES.IPokeAPI)
    private readonly _pokeAPI: IPokeAPI;

    public parseQuery(rawQuery: any): IPokeQuery {
        if ("id" in rawQuery && "type" in rawQuery) {
            const parsedQuery: IPokeQuery = {
                ids: [],
                type: rawQuery.type,
            };
            _.split(rawQuery.id, ",").forEach((potentialId: string) => {
                const parsedId: number = _.toInteger(potentialId);
                if (!_.isNaN(parsedId) && _.toString(parsedId) === potentialId) {
                    parsedQuery.ids.push(parsedId);
                }
            });
            if (parsedQuery.ids.length === 0) {
                const noValidIdError: IResponse = {
                    body: {
                        error: "At least one valid id must be provided!",
                    },
                    status: 400,
                };
                throw noValidIdError;
            }
            return parsedQuery;
        }
        const missingParameterError: IResponse = {
            body: {
                error: "At least one of required parameters was ommited! Required parameters are: id, type",
            },
            status: 400,
        };
        throw missingParameterError;
    }

    public async executeQuery(parsedQuery: IPokeQuery): Promise<IResponse> {
        if (await this._validateQueriedType(parsedQuery.type)) {
            const pokemonsOfThisType: IPokeDetails[] = await this._pokeAPI.getPokemonsByType(parsedQuery.type);
            const response: IResponse = {
                body: {
                    pokemons: _.map(
                                    _.filter(
                                        pokemonsOfThisType,
                                        (pokemon) => _.includes(parsedQuery.ids, pokemon.id),
                                    ),
                                    (pokemon) => pokemon.name,
                    ),
                },
                status: 200,
            };
            if (response.body.pokemons.length === 0) {
                const notFoundResponse: IResponse = {
                    body: {
                        error: "Your search gave no matches!",
                    },
                    status: 404,
                };
                return notFoundResponse;
            }
            return response;
        } else { 
            const pokeTypeError: IResponse = {
                body: {
                    error: `Given Pokemon type is incorrect!`,
                },
                status: 500,
            };
            return pokeTypeError;
        }
    }

    private async _validateQueriedType(queriedType: string): Promise<boolean> {
        return _.includes(await this._pokeAPI.getPokemonTypes(), queriedType);
    }
}
