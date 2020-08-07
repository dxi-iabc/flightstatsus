export interface ConfigOptions {
    hlf: HlfConfigOptions;
}

export type AdminCreds = {
    MspID: string
};

export type TLSOptions = {
    trustedRoots: Array<any>,
    verify: boolean
};

export type HlfConfigOptions = {
    walletPath: string;
    admin: AdminCreds;
    channelId: string;
    chaincodeId: string;
    peerUrls: string[];
    eventUrl: string;
    ordererUrl: string;
    tlsOptions: TLSOptions,
    caName: string,
    url:string
};