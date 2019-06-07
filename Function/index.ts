import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { container } from "../ioc/inversify.config";
import { COMMON_TYPES } from "../ioc/commonTypes";
import { Logger } from "../services/logger";
import { ILogger } from "../services/iLogger";

const httpTrigger: AzureFunction = async (ctx: Context, httpRequest: HttpRequest): Promise<void> => {
    const logger: Logger = container.get<ILogger>(COMMON_TYPES.ILogger) as Logger;
    logger.init(ctx, "1");
};

export default httpTrigger;
