import "reflect-metadata";
import {Container} from "inversify";
import {COMMON_TYPES} from "./commonTypes";

import {Logger} from "../services/logger";
import {ILogger} from "../services/iLogger";


const container: Container = new Container();

container
    .bind<ILogger>(COMMON_TYPES.ILogger)
    .to(Logger)
    .inSingletonScope();

export {container};
