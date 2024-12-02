import { TreeItem, TreeItemCollapsibleState } from "vscode";
import Resource from "./IResource";
import { programMeta } from "./ResourceMeta";


class Program extends Resource {

    name: string;

    constructor(name: string) {
        super(programMeta);
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    newCopy() {

    }
}

class ResourceTreeItem extends TreeItem {

    resource: Resource;

    constructor(resource: Resource) {
        super(resource.getName(), TreeItemCollapsibleState.None);
        this.resource = resource;
    }
}
