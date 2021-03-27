"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeBody = void 0;
const util_1 = require("util");
function decodeBody(body, charset) {
    try {
        return body.toString(charset);
    }
    catch {
        try {
            return new util_1.TextDecoder(charset).decode(body);
        }
        catch {
            return body;
        }
    }
}
exports.decodeBody = decodeBody;
