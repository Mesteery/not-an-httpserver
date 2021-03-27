"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUrl = void 0;
const url_1 = require("url");
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function createUrl(input, host) {
    if (host && !/^[a-z]+:\/\//i.test(host)) {
        host = 'http://' + host;
    }
    const url = new url_1.URL(input, host || 'http://fake');
    return {
        href: host ? url.href : undefined,
        origin: host ? url.origin : undefined,
        username: url.username || undefined,
        password: url.password || undefined,
        host: host ? url.host : undefined,
        hostname: host ? url.hostname : undefined,
        pathname: url.pathname,
        port: url.port ? parseInt(url.port, 10) : undefined,
        search: url.search || undefined,
        urlSearchParams: url.searchParams,
        hash: url.hash || undefined,
        toString: url.toString,
        toJSON: url.toJSON,
    };
}
exports.createUrl = createUrl;
