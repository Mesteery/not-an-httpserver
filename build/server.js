"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.badRequestResponse = void 0;
const net_1 = require("net");
const events_1 = require("events");
const utils_1 = require("./utils");
const request_1 = require("./request");
const response_1 = require("./response");
exports.badRequestResponse = Buffer.from(`HTTP/1.0 400 ${utils_1.STATUS_CODES.get(400)}${utils_1.CRLF}Connection: close${utils_1.CRLF}${utils_1.CRLF}`, 'ascii');
class Server extends net_1.Server {
    constructor(requestListener) {
        super();
        if (requestListener) {
            this.on('request', requestListener);
        }
        this.on('connection', this.handleConnection);
    }
    async handleSocketError(socket, error) {
        if (!this.emit('clientError', error, socket)) {
            if (socket.writable && socket.bytesWritten === 0) {
                socket.write(exports.badRequestResponse);
            }
            socket.destroy(error);
        }
    }
    async handleSocketTimeout(socket, response) {
        const responseTimeout = response?.emit('timeout', socket);
        const serverTimeout = this.emit('timeout', socket);
        if (!responseTimeout && !serverTimeout) {
            socket.destroy();
        }
    }
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async handleConnection(socket) {
        const data = (await events_1.once(socket, 'data'))[0];
        // eslint-disable-next-line prefer-const
        let response;
        socket.once('error', (error) => this.handleSocketError(socket, error));
        socket.on('timeout', () => this.handleSocketTimeout(socket, response));
        const firstCrlf = data.indexOf(utils_1.CRLF);
        if (firstCrlf === -1) {
            socket.write(exports.badRequestResponse);
            socket.destroy();
            return;
        }
        const requestLine = data.slice(0, firstCrlf).toString('ascii').split(' ', 4);
        if (requestLine.length !== 3 ||
            !utils_1.httpVersions.has(requestLine[2]) ||
            !utils_1.httpMethods.has(requestLine[0])) {
            socket.write(exports.badRequestResponse);
            socket.destroy();
            return;
        }
        const requestHeadEnd = data.indexOf(utils_1.CRLF + utils_1.CRLF);
        const rawHeaders = {};
        let body;
        if (requestHeadEnd > firstCrlf) {
            const headersPart = data.slice(firstCrlf + utils_1.CRLF.length, requestHeadEnd);
            if (headersPart.length < 3) {
                socket.write(exports.badRequestResponse);
                socket.destroy();
                return;
            }
            for (const header of headersPart.toString('ascii').split(utils_1.CRLF)) {
                if (header.length < 3) {
                    socket.write(exports.badRequestResponse);
                    socket.destroy();
                    return;
                }
                const colonIndex = header.indexOf(':');
                if (colonIndex < 1) {
                    socket.write(exports.badRequestResponse);
                    socket.destroy();
                    return;
                }
                rawHeaders[header.slice(0, colonIndex).toLowerCase().trim()] = header.slice(colonIndex + 1).trim();
            }
            const bodyStart = requestHeadEnd + utils_1.CRLF.length * 2;
            const bodyLength = data.length - bodyStart;
            const contentLength = rawHeaders['content-length'];
            if (contentLength) {
                const parsedLength = parseInt(contentLength, 10);
                if (isNaN(parsedLength) || parsedLength < 0 || parsedLength > bodyLength) {
                    socket.write(exports.badRequestResponse);
                    socket.destroy();
                    return;
                }
                rawHeaders['content-length'] = parsedLength;
                body = parsedLength === 0 ? undefined : data.slice(bodyStart, bodyStart + parsedLength);
            }
            else {
                body = bodyLength === 0 ? undefined : data.slice(bodyStart);
            }
        }
        let url;
        try {
            url = utils_1.createUrl(requestLine[1], rawHeaders.host);
        }
        catch {
            socket.write(exports.badRequestResponse);
            socket.destroy();
            return;
        }
        const request = new request_1.Request({
            method: requestLine[0],
            url,
            httpVersion: requestLine[2],
            rawHeaders,
            body,
            charset: utils_1.parseContentTypeCharset(rawHeaders['content-type']),
        });
        response = new response_1.Response(socket);
        this.emit('request', request, response);
    }
}
exports.Server = Server;
