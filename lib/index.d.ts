export declare class AbortPromiseError extends Error {
    name: string;
}
export declare const runPromises: <T extends unknown>(promisesArray: (() => Promise<T>)[], options: {
    limit?: number | undefined;
    signal?: AbortSignal | undefined;
    onProgress?: ((progressObject: {
        progress: number;
        fail: number;
        done: number;
        total: number;
    }) => void) | undefined;
    bailOnFail?: boolean | undefined;
}) => Promise<T[]>;
export default runPromises;
