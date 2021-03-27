import { TextDecoder } from 'util';

export function decodeBody(body: Buffer, charset?: string): string | Buffer {
	try {
		return body.toString(charset as BufferEncoding);
	} catch {
		try {
			return new TextDecoder(charset).decode(body);
		} catch {
			return body;
		}
	}
}
