import "reflect-metadata";
import {Container} from "inversify";
import {COMMON_TYPES} from "./commonTypes";

import {Logger} from "../commonServices/logger";
import {ILogger} from "../commonServices/iLogger";
import { IFunctionService } from "../HttpTrigger/services/IFunctionService";
import { FunctionService } from "../HttpTrigger/services/FunctionService";

import { IPokeFinder } from "../HttpTrigger/utils/IPokeFinder";
import { PokeFinder } from "../HttpTrigger/utils/PokeFinder";
import { IPokeAPI } from "../HttpTrigger/utils/IPokeAPI";
import { PokeAPI } from "../HttpTrigger/utils/PokeAPI";

const getContainer: (() => Container) = (): Container => {
    const container: Container = new Container();
    
    container
        .bind<ILogger>(COMMON_TYPES.ILogger)
        .to(Logger)
        .inSingletonScope();
    
    container
        .bind<IFunctionService<any>>(COMMON_TYPES.IFunctionService)
        .to(FunctionService);

    container
        .bind<IPokeFinder>(COMMON_TYPES.IPokeFinder)
        .to(PokeFinder);

    container
        .bind<IPokeAPI>(COMMON_TYPES.IPokeAPI)
        .to(PokeAPI);

    return container;
};

export default getContainer;
