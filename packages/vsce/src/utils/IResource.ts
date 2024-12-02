import { resourceMeta } from "./ResourceMeta";

abstract class Resource {

    meta: resourceMeta;

    constructor(meta: resourceMeta) {
        this.meta = meta;
    }

    getType() {
        return this.meta.type;
    }
    getResourceKey() {
        return this.meta.resourceKey;
    }

    abstract getName(): string;
}

export default Resource;
