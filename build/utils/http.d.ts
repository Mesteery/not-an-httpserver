export declare const CRLF = "\r\n";
export declare const STATUS_CODES: Map<200 | 201 | 202 | 204 | 300 | 301 | 302 | 304 | 400 | 401 | 402 | 403 | 404 | 500 | 501 | 502 | 503, "OK" | "Created" | "Accepted" | "No Content" | "Multiple Choices" | "Moved Permanently" | "Found" | "Not Modified" | "Bad Request" | "Unauthorized" | "Payment Required" | "Forbidden" | "Not Found" | "Internal Server Error" | "Not Implemented" | "Bad Gateway" | "Service Unavailable">;
export declare type StatusCodes = typeof STATUS_CODES extends Map<infer C, infer V> ? C : never;
export declare const httpMethods: Set<"GET" | "POST" | "HEAD" | "PUT" | "LINK" | "UNLINK" | "DELETE">;
export declare type HttpMethods = typeof httpMethods extends Set<infer R> ? R : never;
export declare const httpVersions: Set<"HTTP/1.0" | "HTTP/1.1">;
export declare type HttpVersions = typeof httpVersions extends Set<infer R> ? R : never;
export declare type Headers = Record<string, string>;
