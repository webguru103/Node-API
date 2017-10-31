import { existsSync, readFileSync } from "fs";
import { resolve } from 'path';

export const ResolvePath = (...args: string[]) => resolve(...args)

/**
 * Sync Resolves and returns file as a buffer if file exists in a provided path or throws non-exists error
 * 
 * @export
 * @param {string} args 
 * @returns {Buffer}
 */
export const ResolveFile = (...args: string[]): Buffer => {
    const _path = ResolvePath(...args);
    if (existsSync(_path)) return readFileSync(_path, {});
    throw new Error(`File at ${_path} does not exist or can't be read`)
};
