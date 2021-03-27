/// <reference types="node" />
export declare function createUrl(input: string, host?: string): {
    readonly href: string | undefined;
    readonly origin: string | undefined;
    readonly username: string | undefined;
    readonly password: string | undefined;
    readonly host: string | undefined;
    readonly hostname: string | undefined;
    readonly pathname: string;
    readonly port: number | undefined;
    readonly search: string | undefined;
    readonly urlSearchParams: import("url").URLSearchParams;
    readonly hash: string | undefined;
    readonly toString: () => string;
    readonly toJSON: () => string;
};
export declare type Url = ReturnType<typeof createUrl>;
