import { IPokeQuery } from "./IPokeQuery";
import { IResponse } from "./IResponse";

export interface IPokeFinder {
    parseQuery(rawQuery: any): IPokeQuery;
    executeQuery(parsedQuery: IPokeQuery): Promise<IResponse>;
}
