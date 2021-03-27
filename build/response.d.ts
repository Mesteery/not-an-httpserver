/// <reference types="node" />
import { Socket } from 'net';
import { Writable } from 'stream';
import { StatusCodes, Headers } from './utils';
export declare class Response extends Writable {
    headers: Headers;
    private $statusCode;
    statusMessage: string;
    private readonly data;
    readonly socket: Socket;
    setDate: boolean;
    constructor(socket: Socket);
    _write(chunk: Buffer | string, encoding: BufferEncoding, done: () => void): void;
    _final(done: () => void): void;
    get statusCode(): number;
    set statusCode(statusCode: number);
    setHeaders(headers: Headers): void;
    writeHead(statusCode: StatusCodes, headers?: Headers): void;
    writeHead<T extends number>(statusCode: T, statusMessage: T extends StatusCodes ? never : string, headers?: Headers): void;
}
