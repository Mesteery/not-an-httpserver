import { Server as TcpServer, Socket } from 'net';
import { once } from 'events';
import {
	createUrl,
	Url,
	parseContentTypeCharset,
	STATUS_CODES,
	CRLF,
	httpMethods,
	httpVersions,
	HttpMethods,
	HttpVersions,
} from './utils';
import { Request, RequestOptions } from './request';
import { Response } from './response';

export const badRequestResponse = Buffer.from(
	`HTTP/1.0 400 ${STATUS_CODES.get(400)}${CRLF}Connection: close${CRLF}${CRLF}`,
	'ascii',
);

export class Server extends TcpServer {
	public constructor(requestListener?: (request: Request, response: Response) => void) {
		super();
		if (requestListener) {
			this.on('request', requestListener);
		}
		this.on('connection', this.handleConnection);
	}

	private async handleSocketError(socket: Socket, error: Error) {
		if (!this.emit('clientError', error, socket)) {
			if (socket.writable && socket.bytesWritten === 0) {
				socket.write(badRequestResponse);
			}
			socket.destroy(error);
		}
	}

	private async handleSocketTimeout(socket: Socket, response?: Response) {
		const responseTimeout = response?.emit('timeout', socket);
		const serverTimeout = this.emit('timeout', socket);

		if (!responseTimeout && !serverTimeout) {
			socket.destroy();
		}
	}

	// eslint-disable-next-line sonarjs/cognitive-complexity
	private async handleConnection(socket: Socket): Promise<void> {
		const data: Buffer = (await once(socket, 'data'))[0];
		// eslint-disable-next-line prefer-const
		let response: Response;

		socket.once('error', (error) => this.handleSocketError(socket, error));
		socket.on('timeout', () => this.handleSocketTimeout(socket, response));

		const firstCrlf = data.indexOf(CRLF);
		if (firstCrlf === -1) {
			socket.write(badRequestResponse);
			socket.destroy();
			return;
		}

		const requestLine = data.slice(0, firstCrlf).toString('ascii').split(' ', 4);

		if (
			requestLine.length !== 3 ||
			!httpVersions.has(requestLine[2] as HttpVersions) ||
			!httpMethods.has(requestLine[0] as HttpMethods)
		) {
			socket.write(badRequestResponse);
			socket.destroy();
			return;
		}

		const requestHeadEnd = data.indexOf(CRLF + CRLF);
		const rawHeaders: Record<string, string> = {};

		let body: Buffer | undefined;
		if (requestHeadEnd > firstCrlf) {
			const headersPart = data.slice(firstCrlf + CRLF.length, requestHeadEnd);
			if (headersPart.length < 3) {
				socket.write(badRequestResponse);
				socket.destroy();
				return;
			}

			for (const header of headersPart.toString('ascii').split(CRLF)) {
				if (header.length < 3) {
					socket.write(badRequestResponse);
					socket.destroy();
					return;
				}

				const colonIndex = header.indexOf(': ');
				if (colonIndex < 1) {
					socket.write(badRequestResponse);
					socket.destroy();
					return;
				}

				rawHeaders[header.slice(0, colonIndex).toLowerCase().trim()] = header.slice(colonIndex + 1).trim();
			}

			const bodyStart = requestHeadEnd + CRLF.length * 2;
			if (bodyStart < data.length) {
				const bodyLength = data.length - bodyStart;

				const contentLength = rawHeaders['content-length'];
				if (contentLength) {
					const parsedLength = parseInt(contentLength, 10);
					if (isNaN(parsedLength) || parsedLength < 0 || parsedLength > bodyLength) {
						socket.write(badRequestResponse);
						socket.destroy();
						return;
					}

					body = parsedLength === 0 ? undefined : data.slice(bodyStart, bodyStart + parsedLength);
				} else {
					body = bodyLength === 0 ? undefined : data.slice(bodyStart);
				}
			}
		}

		let url: Url;
		try {
			url = createUrl(requestLine[1], rawHeaders.host);
		} catch {
			socket.write(badRequestResponse);
			socket.destroy();
			return;
		}

		const request = new Request({
			method: requestLine[0] as RequestOptions['method'],
			url,
			httpVersion: requestLine[2] as RequestOptions['httpVersion'],
			rawHeaders,
			body,
			charset: parseContentTypeCharset(rawHeaders['content-type']),
		});
		response = new Response(socket);

		this.emit('request', request, response);
	}
}
