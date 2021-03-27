"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpVersions = exports.httpMethods = exports.STATUS_CODES = exports.CRLF = void 0;
exports.CRLF = '\r\n';
exports.STATUS_CODES = new Map([
    [200, 'OK'],
    [201, 'Created'],
    [202, 'Accepted'],
    [204, 'No Content'],
    [300, 'Multiple Choices'],
    [301, 'Moved Permanently'],
    [302, 'Found'],
    [304, 'Not Modified'],
    [400, 'Bad Request'],
    [401, 'Unauthorized'],
    [402, 'Payment Required'],
    [403, 'Forbidden'],
    [404, 'Not Found'],
    [500, 'Internal Server Error'],
    [501, 'Not Implemented'],
    [502, 'Bad Gateway'],
    [503, 'Service Unavailable'],
]);
exports.httpMethods = new Set(['GET', 'POST', 'HEAD', 'PUT', 'LINK', 'UNLINK', 'DELETE']);
exports.httpVersions = new Set(['HTTP/1.0', 'HTTP/1.1']);
