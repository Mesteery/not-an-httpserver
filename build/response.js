"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const stream_1 = require("stream");
const utils_1 = require("./utils");
class Response extends stream_1.Writable {
    constructor(socket) {
        super();
        this.headers = {};
        this.$statusCode = 200;
        this.statusMessage = utils_1.STATUS_CODES.get(200);
        this.data = [];
        this.setDate = true;
        socket.once('close', () => socket.destroy());
        this.socket = socket;
    }
    _write(chunk, encoding, done) {
        this.data.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk.toString(), encoding));
        done();
    }
    _final(done) {
        const body = Buffer.concat(this.data);
        let stringifiedHeaders = (this.setDate ? `Date: ${new Date().toUTCString()}${utils_1.CRLF}` : '') +
            `Connection: close${utils_1.CRLF}` +
            (body.byteLength ? `Content-Length: ${body.byteLength}${utils_1.CRLF}` : '');
        for (const k in this.headers) {
            const headerName = k.toLowerCase();
            if (headerName === 'connection' ||
                (body.byteLength && headerName === 'content-length') ||
                (this.setDate && headerName === 'date')) {
                continue;
            }
            stringifiedHeaders += `${headerName}: ${this.headers[k]}${utils_1.CRLF}`;
        }
        const responseHead = Buffer.from(`HTTP/1.0 ${this.$statusCode} ${this.statusMessage}${utils_1.CRLF}${stringifiedHeaders}${utils_1.CRLF}`, 'ascii');
        this.socket.write(body.byteLength === 0 ? responseHead : Buffer.concat([responseHead, body]), done);
        this.socket.destroy();
    }
    get statusCode() {
        return this.$statusCode;
    }
    set statusCode(statusCode) {
        this.$statusCode = statusCode;
        this.statusMessage = utils_1.STATUS_CODES.get(statusCode) ?? 'Unknown Message';
    }
    setHeaders(headers) {
        this.headers = { ...this.headers, ...headers };
    }
    writeHead(statusCode, statusMessage, headers) {
        this.$statusCode = statusCode;
        if (typeof statusMessage === 'string') {
            this.statusMessage = statusMessage;
            if (headers) {
                this.setHeaders(headers);
            }
        }
        else {
            this.statusMessage = utils_1.STATUS_CODES.get(statusCode) ?? 'Unknown Message';
            if (statusMessage && typeof statusMessage === 'object') {
                this.setHeaders(statusMessage);
            }
        }
    }
}
exports.Response = Response;
