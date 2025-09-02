// 虽然简短但不直观
// export type DownloadTarget = Record<'publisherName'|'extensionName'|'version'>;

export interface DownloadTarget{
    publisherName:string
    extensionName:string
    version:string
    targetPlatform?:string
}