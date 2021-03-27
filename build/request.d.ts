/// <reference types="node" />
import type { Url, HttpMethods, HttpVersions } from './utils';
export interface RequestOptions {
    httpVersion: HttpVersions;
    method: HttpMethods;
    rawHeaders: Record<string, string | number>;
    url: Url;
    body: Buffer | undefined;
    charset: string | undefined;
}
export declare class Request implements RequestOptions {
    readonly httpVersion: RequestOptions['httpVersion'];
    readonly method: RequestOptions['method'];
    readonly rawHeaders: RequestOptions['rawHeaders'];
    readonly url: RequestOptions['url'];
    readonly body: RequestOptions['body'];
    readonly charset: RequestOptions['charset'];
    constructor({ httpVersion, url, method, rawHeaders, body, charset }: RequestOptions);
}
