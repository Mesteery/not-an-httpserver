"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
class Request {
    constructor({ httpVersion, url, method, rawHeaders, body, charset }) {
        this.httpVersion = httpVersion;
        this.url = url;
        this.method = method;
        this.rawHeaders = rawHeaders;
        this.body = body;
        this.charset = charset;
    }
}
exports.Request = Request;
