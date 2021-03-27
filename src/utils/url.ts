import { URL } from 'url';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createUrl(input: string, host?: string) {
	if (host && !/^[a-z]+:\/\//i.test(host)) {
		host = 'http://' + host;
	}
	const url = new URL(input, host || 'http://fake');
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
	} as const;
}

export type Url = ReturnType<typeof createUrl>;
