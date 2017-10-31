import { promisify } from 'bluebird'
import { createHash, pbkdf2, timingSafeEqual, randomBytes, createHmac } from 'crypto'
import { deflateRaw, inflateRaw } from 'zlib'

const pbkdf2Async =  promisify(pbkdf2)
const randomBytesAsync = promisify(randomBytes)
const deflateRawAsync = promisify(deflateRaw)
const inflateRawAsync = promisify(inflateRaw)

/**
 * Async Generates HMAC key hash for provided params
 * 
 * @export
 * @param {string} key 
 * @param {(string | Buffer)} text 
 * @param {string} [algorithm='sha256'] 
 * @returns {Promise<string>} 
 */
export async function GenerateHmac(key: string, text: string | Buffer, algorithm: string = 'sha256'): Promise<string> {
    return createHmac(algorithm, key).update(text).digest('hex')
}

/**
 * Async Deflate algorythm which works with all strings (i.e. serialized to JSON data)
 * 
 * @export
 * @param {string} string 
 * @returns 
 */
export async function Deflate(string: string){
    const deflated = await deflateRawAsync(Buffer.from(string))
    return (<Buffer>deflated).toString('base64') //Only Base64 works correctly
}
/**
 * Async Inflate algorythm which works will all strings  (i.e. serialized to JSON data)
 * 
 * @export
 * @param {string} string 
 * @returns 
 */
export async function Inflate(string: string){
    const inflated = await inflateRawAsync(Buffer.from(string, 'base64')) //Only Base64 works correctly
    return inflated.toString()
}
/**
 * Async Generates MD5 hash for provided params
 * 
 * @export
 * @param {...string[]} args 
 * @returns {string} 
 */
export async function GenerateMD5Hash (...args: string[]): Promise<string> {
    const hash = createHash('md5')
    const arr = Array.of(...args).reduce( (p,c) => p + c ) 
    const buf = Buffer.from(arr)
    return hash.update(buf).digest('hex').toString()
}
/**
 * Async Provides Password-Based Key Derivation Function 2 key with a standard SHA512 algorythm
 * 
 * @export
 * @param {string} password 
 * @param {string} salt 
 * @param {number} [iterations=1000] 
 * @param {number} [keylen=64] 
 * @param {string} [digest='sha512'] 
 * @returns 
 */
export function generatePBKDF2Key(password: string, salt: string, iterations: number = 1000, keylen: number = 64, digest: string = 'sha512'){
    return pbkdf2Async(password, salt, 1000, 64, 'sha512').then( buffer => buffer.toString('hex') )
}
/**
 * Async Constant time Buffer comparison. Hash length is always set to 128 characters, thus no need to check the lengths
 * 
 * @export
 * @param {(string | undefined)} password1 
 * @param {(string | undefined)} password2 
 * @returns {boolean} 
 */
export async function compareHashes(password1:string | undefined, password2:string | undefined): Promise<boolean>{
    const str1 = String(password1)
    const str2 = String(password2)
    if (str1.length !== str2.length) return false
    return timingSafeEqual( Buffer.from(str1), Buffer.from(str2) )
}
/**
 * Async Generates random string for a specified size
 * 
 * @export
 * @param {number} [size=16] 
 * @returns 
 */
export async function generateRandomString(size: number = 16){
    return randomBytesAsync(size).then( buffer => buffer.toString('hex').slice(0, size))
}