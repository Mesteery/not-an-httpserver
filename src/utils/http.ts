export const CRLF = '\r\n';
export const STATUS_CODES = new Map([
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
] as const);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type StatusCodes = typeof STATUS_CODES extends Map<infer C, infer V> ? C : never;

export const httpMethods = new Set(['GET', 'POST', 'HEAD', 'PUT', 'LINK', 'UNLINK', 'DELETE'] as const);
export type HttpMethods = typeof httpMethods extends Set<infer R> ? R : never;

export const httpVersions = new Set(['HTTP/1.0', 'HTTP/1.1'] as const);
export type HttpVersions = typeof httpVersions extends Set<infer R> ? R : never;

export type Headers = Record<string, string>;
