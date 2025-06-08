export interface ExtensionItem {
    publisher: Publisher
    extensionId: string
    extensionName: string
    displayName: string
    flags: string
    lastUpdated: string
    publishedDate: string
    releaseDate: string
    shortDescription?: string
    versions: Version[]
    categories: string[]
    tags: string[]
    statistics: Statistic[]
    installationTargets: InstallationTarget[]
    deploymentType: number
}

export interface Publisher {
    publisherId: string
    publisherName: string
    displayName: string
    flags: string
    domain?: string
    isDomainVerified: boolean
}

export interface Version {
    version: string
    flags: string
    lastUpdated: string
    files: File[]
    properties: Property[]
    assetUri: string
    fallbackAssetUri: string
}

export interface File {
    assetType: string
    source: string
}

export interface Property {
    key: string
    value: string
}

export interface Statistic {
    statisticName: string
    value: number
}

export interface InstallationTarget {
    target: string
    targetVersion: string
}
