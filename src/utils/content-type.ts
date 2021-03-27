export function parseContentTypeCharset(contentType?: string): string | undefined {
	if (!contentType) {
		return;
	}

	const parametersStart = contentType.indexOf(';');
	if (parametersStart === -1) {
		return;
	}

	const parameters = contentType.slice(parametersStart);
	const charsetStart = parameters.indexOf('charset');
	if (charsetStart === -1) {
		return;
	}
	const charsetEnd = parameters.indexOf(';', charsetStart);
	return parameters.slice(charsetStart, charsetEnd === -1 ? undefined : charsetEnd);
}
