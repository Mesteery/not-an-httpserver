import type { Url, HttpMethods, HttpVersions } from './utils';
export interface RequestOptions {
	httpVersion: HttpVersions;
	method: HttpMethods;
	rawHeaders: Record<string, string | number>;
	url: Url;
	body: Buffer | undefined;
	charset: string | undefined;
}

export class Request implements RequestOptions {
	public readonly httpVersion: RequestOptions['httpVersion'];
	public readonly method: RequestOptions['method'];
	public readonly rawHeaders: RequestOptions['rawHeaders'];
	public readonly url: RequestOptions['url'];
	public readonly body: RequestOptions['body'];
	public readonly charset: RequestOptions['charset'];

	public constructor({ httpVersion, url, method, rawHeaders, body, charset }: RequestOptions) {
		this.httpVersion = httpVersion;
		this.url = url;
		this.method = method;
		this.rawHeaders = rawHeaders;
		this.body = body;
		this.charset = charset;
	}
}
