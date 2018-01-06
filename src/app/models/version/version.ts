export class Version {
    constructor(public _id: string,
                public versionNumber: string,
                public features: string[],
                public fixes: string[],
                public knownIssues: string[],
                public creationDate: Date) {
    }
}
