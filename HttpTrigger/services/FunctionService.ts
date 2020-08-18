import { inject, injectable } from "inversify";
import { IFunctionService } from "./IFunctionService";
import { COMMON_TYPES } from "../../ioc/commonTypes";
import { ILogger } from "../../commonServices/iLogger";
import { IResponse } from "../utils/IResponse";
import { IPokeQuery } from "../utils/IPokeQuery";
import { IPokeFinder } from "../utils/IPokeFinder";

@injectable()
export class FunctionService implements IFunctionService<any> {

    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;

    @inject(COMMON_TYPES.IPokeFinder)
    private readonly _pokeFinder: IPokeFinder;

    public async processMessageAsync(rawQuery: any): Promise<IResponse> {
        this._logger.info("Poke function received request. Parsing query");

        this._logger.verbose(`Raw query: ${JSON.stringify(rawQuery)}`);
        let parsedQuery: IPokeQuery;
        try {
            parsedQuery = this._pokeFinder.parseQuery(rawQuery);
        } catch (parsingError) {
            this._logger.error(`Error occured while parsing query: "${parsingError.body.error}".`);
            return parsingError;
        }
        this._logger.info("Poke function succesfully parsed query. Executing parsed query");
        this._logger.verbose(`Parsed query: ${JSON.stringify(parsedQuery)}`);
        let queryResult: IResponse;
        try {
            queryResult = await this._pokeFinder.executeQuery(parsedQuery);
        } catch (executeError) {
            this._logger.error(`Error occured while parsing query: "${executeError.body.error}"`);
            return executeError;
        }
        this._logger.info("Poke function succesfully executed query. Sending result to user");
        this._logger.verbose(`Query result: ${JSON.stringify(queryResult)}`);

        return queryResult;
    }
}
