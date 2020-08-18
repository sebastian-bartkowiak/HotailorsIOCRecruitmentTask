export interface IFunctionService<T> {
    processMessageAsync(query: T): Promise<any>;
}
