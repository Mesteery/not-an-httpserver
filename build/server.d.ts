/// <reference types="node" />
import { Server as TcpServer } from 'net';
import { Request } from './request';
import { Response } from './response';
export declare const badRequestResponse: Buffer;
export declare class Server extends TcpServer {
    constructor(requestListener?: (request: Request, response: Response) => void);
    private handleSocketError;
    private handleSocketTimeout;
    private handleConnection;
}
