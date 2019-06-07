import "reflect-metadata";
import {Container} from "inversify";
import {COMMON_TYPES} from "./commonTypes";

import {Logger} from "../services/logger";
import {ILogger} from "../services/iLogger";
import { IFunctionService } from "../HttpTrigger/services/IFunctionService";
import { FunctionService } from "../HttpTrigger/services/FunctionService";

const container: Container = new Container();

container
    .bind<ILogger>(COMMON_TYPES.ILogger)
    .to(Logger)
    .inSingletonScope();

container
    .bind<IFunctionService<any>>(COMMON_TYPES.IFunctionService)
    .to(FunctionService);
export {container};
