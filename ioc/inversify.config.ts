import "reflect-metadata";
import {Container} from "inversify";
import {COMMON_TYPES} from "./commonTypes";

import {Logger} from "../commonServices/logger";
import {ILogger} from "../commonServices/iLogger";
import { IFunctionService } from "../AzureFunction/functionServices/IFunctionService";
import { FunctionService } from "../AzureFunction/functionServices/FunctionService";

const container: Container = new Container();

container
    .bind<ILogger>(COMMON_TYPES.ILogger)
    .to(Logger)
    .inSingletonScope();

container
    .bind<IFunctionService<any>>(COMMON_TYPES.IFunctionService)
    .to(FunctionService);
export {container as commonContainer};
