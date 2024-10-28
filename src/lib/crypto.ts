import { env } from "../env";
import { AES, enc } from "crypto-js";

export function encrypt(data:string){
    return AES.encrypt(data, env.CRYPTO_SECRET).toString();
}

export function decrypt(data:string){

    return AES.decrypt(data, env.CRYPTO_SECRET).toString(enc.Utf8);
}