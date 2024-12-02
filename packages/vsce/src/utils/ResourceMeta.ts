
export interface resourceMeta {
    resourceKey: string;
    type: string;
    attributes: string[];
}

export const programMeta: resourceMeta = {
    resourceKey: "program",
    type: "CICSProgram",
    attributes: [
        "newcopycnt",
        "status",
        "changeusrid",
    ]
};

export const bundleMeta: resourceMeta = {
    resourceKey: "name",
    type: "CICSBundle",
    attributes: [
        "enablestatus",
        "partcount",
        "installagent",
    ]
};

export const transactionMeta: resourceMeta = {
    resourceKey: "tranid",
    type: "CICSLocalTransaction",
    attributes: [
        "program",
        "status",
        "purgeability",
    ]
};

