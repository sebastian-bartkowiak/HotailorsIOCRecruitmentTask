import { inject, injectable } from "inversify";
import { IFunctionService } from "./IFunctionService";
import { COMMON_TYPES } from "../../ioc/commonTypes";
import { ILogger } from "../../commonServices/iLogger";

@injectable()
export class FunctionService implements IFunctionService<any> {

    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;

    public async processMessageAsync(msg: any): Promise<any> {
        this._logger.info("Hello world");
        this._logger.verbose(`${msg}`);
        return {msg: "success"};
    }
}
