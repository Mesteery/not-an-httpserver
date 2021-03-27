import { Socket } from 'net';
import { Writable } from 'stream';
import { CRLF, StatusCodes, STATUS_CODES, Headers } from './utils';

export class Response extends Writable {
	public headers: Headers = {};
	private $statusCode = 200;
	public statusMessage: string = STATUS_CODES.get(200)!;
	private readonly data: Buffer[] = [];
	public readonly socket: Socket;
	public setDate = true;

	public constructor(socket: Socket) {
		super();
		socket.once('close', () => socket.destroy());
		this.socket = socket;
	}

	public _write(chunk: Buffer | string, encoding: BufferEncoding, done: () => void): void {
		this.data.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk.toString(), encoding));
		done();
	}

	public _final(done: () => void): void {
		const body = Buffer.concat(this.data);
		let stringifiedHeaders =
			(this.setDate ? `Date: ${new Date().toUTCString()}${CRLF}` : '') +
			`Connection: close${CRLF}` +
			(body.byteLength ? `Content-Length: ${body.byteLength}${CRLF}` : '');

		for (const k in this.headers) {
			const headerName = k.toLowerCase();
			if (
				headerName === 'connection' ||
				(body.byteLength && headerName === 'content-length') ||
				(this.setDate && headerName === 'date')
			) {
				continue;
			}
			stringifiedHeaders += `${headerName}: ${this.headers[k]}${CRLF}`;
		}

		const responseHead = Buffer.from(
			`HTTP/1.0 ${this.$statusCode} ${this.statusMessage}${CRLF}${stringifiedHeaders}${CRLF}`,
			'ascii',
		);

		this.socket.write(body.byteLength === 0 ? responseHead : Buffer.concat([responseHead, body]), done);
		this.socket.destroy();
	}

	public get statusCode(): number {
		return this.$statusCode;
	}

	public set statusCode(statusCode: number) {
		this.$statusCode = statusCode;
		this.statusMessage = STATUS_CODES.get(statusCode as StatusCodes) ?? 'Unknown Message';
	}

	public setHeaders(headers: Headers): void {
		this.headers = { ...this.headers, ...headers };
	}

	public writeHead(statusCode: StatusCodes, headers?: Headers): void;
	public writeHead<T extends number>(
		statusCode: T,
		statusMessage: T extends StatusCodes ? never : string,
		headers?: Headers,
	): void;
	public writeHead(statusCode: number, statusMessage?: string | Headers, headers?: Headers): void {
		this.$statusCode = statusCode;
		if (typeof statusMessage === 'string') {
			this.statusMessage = statusMessage;
			if (headers) {
				this.setHeaders(headers);
			}
		} else {
			this.statusMessage = STATUS_CODES.get(statusCode as StatusCodes) ?? 'Unknown Message';
			if (statusMessage && typeof statusMessage === 'object') {
				this.setHeaders(statusMessage);
			}
		}
	}
}
