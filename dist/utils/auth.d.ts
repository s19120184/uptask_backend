export declare const hashPassword: (password: string) => Promise<string>;
export declare const checkPassword: (password: string, storedhash: string) => Promise<boolean>;
