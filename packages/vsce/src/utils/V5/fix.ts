import { getResource } from "@zowe/cics-for-zowe-sdk";
import { IProfileLoaded, ISession, Session } from "@zowe/imperative";
import { Event, EventEmitter, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PersistentStorage } from "../PersistentStorage";
import { ProfileManagement } from "../profileManagement";


interface IProgram {
    eyu_cicsname: string;
    eyu_cicsrel: string;
    eyu_reserved: string;
    program: string;
    aloadtime: string;
    apist: string;
    application: string;
    applmajorver: string;
    applmicrover: string;
    applminorver: string;
    basdefinever: string;
    cedfstatus: string;
    changeagent: string;
    changeagrel: string;
    changetime: string;
    changeusrid: string;
    coboltype: string;
    concurrency: string;
    copy: string;
    currentloc: string;
    datalocation: string;
    definesource: string;
    definetime: string;
    dynamstatus: string;
    entrypoint: string;
    execkey: string;
    executionset: string;
    fetchcnt: string;
    fetchtime: string;
    holdstatus: string;
    hotpooling: string;
    installagent: string;
    installtime: string;
    installusrid: string;
    jvmclass: string;
    jvmdebug: string;
    jvmprofile: string;
    jvmserver: string;
    language: string;
    length: string;
    library: string;
    librarydsn: string;
    loadpoint: string;
    lpastat: string;
    newcopycnt: string;
    operation: string;
    pgrjusecount: string;
    platform: string;
    progtype: string;
    remotename: string;
    remotesystem: string;
    removecnt: string;
    rescount: string;
    residency: string;
    rloading: string;
    rplid: string;
    rremoval: string;
    runtime: string;
    ruse: string;
    sharestatus: string;
    status: string;
    transid: string;
    useagelstat: string;
    usecount: string;
    usefetch: string;
}

interface ITransaction {
    eyu_cicsname: string;
    eyu_cicsrel: string;
    eyu_reserved: string;
    tranid: string;
    abendcnt: string;
    actmismats: string;
    application: string;
    applmajorver: string;
    applmicrover: string;
    applminorver: string;
    availstatus: string;
    basdefinever: string;
    brexit: string;
    changeagent: string;
    changeagrel: string;
    changetime: string;
    changeusrid: string;
    cmdsec: string;
    definesource: string;
    definetime: string;
    dtb: string;
    dtimeout: string;
    dumping: string;
    facilitylike: string;
    foractindto: string;
    foractnowt: string;
    foractoper: string;
    foractother: string;
    foracttrndf: string;
    indoubt: string;
    indoubtmins: string;
    indoubtwait: string;
    installagent: string;
    installtime: string;
    installusrid: string;
    isolatest: string;
    localcnt: string;
    numindoubwt: string;
    operation: string;
    otstimeout: string;
    platform: string;
    priority: string;
    profile: string;
    program: string;
    purgeability: string;
    remotecnt: string;
    remotename: string;
    remotesystem: string;
    remstartcnt: string;
    ressec: string;
    restartcnt: string;
    routestatus: string;
    routing: string;
    rtimeout: string;
    runaway: string;
    runawaytype: string;
    scrnsize: string;
    shutdown: string;
    status: string;
    stgvcnt: string;
    storageclear: string;
    taskdatakey: string;
    taskdataloc: string;
    tracing: string;
    tranclass: string;
    trprof: string;
    twasize: string;
    usecount: string;
}

interface IBundle {
    eyu_cicsname: string;
    eyu_cicsrel: string;
    eyu_reserved: string;
    name: string;
    availstatus: string;
    basdefinever: string;
    basescope: string;
    bundledir: string;
    bundleid: string;
    changeagent: string;
    changeagrel: string;
    changetime: string;
    changeusrid: string;
    definesource: string;
    definetime: string;
    enabledcount: string;
    enablestatus: string;
    installagent: string;
    installtime: string;
    installusrid: string;
    majorversion: string;
    mgmtpart: string;
    microversion: string;
    minorversion: string;
    partcount: string;
    targetcount: string;
}

interface IBundlePart {
    eyu_cicsname: string;
    eyu_cicsrel: string;
    eyu_reserved: string;
    bundle: string;
    bundlepart: string;
    seqnumber: string;
    availstatus: string;
    enablestatus: string;
    metadatafile: string;
    operation: string;
    partclass: string;
    parttype: string;
}

interface IRegion {
    eyu_cicsname: string;
    eyu_cicsrel: string;
    eyu_reserved: string;
    acthptcbs: string;
    actjvmtcbs: string;
    actopentcbs: string;
    actssltcbs: string;
    actthrdtcbs: string;
    actxptcbs: string;
    aidcount: string;
    ainscreq: string;
    ainsmreq: string;
    ainsprog: string;
    ainsstat: string;
    akp: string;
    amaxtasks: string;
    applid: string;
    auxstatus: string;
    bmsvalabcnt: string;
    bmsvalidate: string;
    bmsvaligcnt: string;
    bmsvallgcnt: string;
    cicsstatus: string;
    cicssys: string;
    cmdprotect: string;
    coldstatus: string;
    consoles: string;
    conversest: string;
    cputime: string;
    ctslevel: string;
    curactvusrtr: string;
    curauxds: string;
    curquedusrtr: string;
    curquetime: string;
    curramax: string;
    currentdds: string;
    currtasks: string;
    cutcbcnt: string;
    ddsostat: string;
    ddssstat: string;
    debugtool: string;
    dfltremsys: string;
    dfltuser: string;
    dsidle: string;
    dsinterval: string;
    dsrtprogram: string;
    dtrprogram: string;
    endofday: string;
    eventclass: string;
    exceptclass: string;
    exittime: string;
    extsec: string;
    forceqr: string;
    frequency: string;
    garbageint: string;
    gmmlength: string;
    gmmtext: string;
    gmmtranid: string;
    grname: string;
    grstatus: string;
    gtfstatus: string;
    idntyclass: string;
    initialdds: string;
    initstatus: string;
    interval: string;
    intstatus: string;
    intvtrans: string;
    ircstat: string;
    jobid: string;
    jobname: string;
    lastcoldtime: string;
    lastemertime: string;
    lastinittime: string;
    lastreset: string;
    lastwarmtime: string;
    ldglbsou: string;
    ldglsort: string;
    ldglwsou: string;
    loadhwmc: string;
    loadhwmw: string;
    loadpniu: string;
    loadreqs: string;
    loadrniu: string;
    loadtime: string;
    loadtniu: string;
    loadwait: string;
    loadwcnt: string;
    lucurr: string;
    luhwm: string;
    maxhptcbs: string;
    maxjvmtcbs: string;
    maxopentcbs: string;
    maxssltcbs: string;
    maxtasks: string;
    maxthrdtcbs: string;
    maxtrcnt: string;
    maxxptcbs: string;
    memlimit: string;
    monrpttime: string;
    monstat: string;
    mrobatch: string;
    mvssysid: string;
    mvssysname: string;
    nexttime: string;
    oprel: string;
    opsys: string;
    oslevel: string;
    pagein: string;
    pageout: string;
    peakamax: string;
    peaktasks: string;
    pekactvusrtr: string;
    pekquedusrtr: string;
    perfclass: string;
    plastreset: string;
    pltpiusr: string;
    prgmrcmp: string;
    prgmucnt: string;
    prgmwait: string;
    progautoattm: string;
    progautoctlg: string;
    progautoexit: string;
    progautofail: string;
    progautoinst: string;
    progautoxrej: string;
    prsserrorcnt: string;
    prssinqcnt: string;
    prssnibcnt: string;
    prssopncnt: string;
    prssunbndcnt: string;
    prtyaging: string;
    psdinterval: string;
    pstype: string;
    rdebrbld: string;
    realstg: string;
    recording: string;
    reentprotect: string;
    regionuserid: string;
    release: string;
    rlsstatus: string;
    rrmsstat: string;
    runaway: string;
    scandelay: string;
    sdmpsupp: string;
    sdmptotl: string;
    sdtran: string;
    shutstatus: string;
    singlestatus: string;
    sioreq: string;
    sosabovebar: string;
    sosaboveline: string;
    sosbelowline: string;
    sosstatus: string;
    startup: string;
    startupdate: string;
    stgprot: string;
    strttime: string;
    subsystemid: string;
    subtasks: string;
    switchstatus: string;
    syncpointst: string;
    sysdump: string;
    sysid: string;
    systemstatus: string;
    tablesize: string;
    tcexitstatus: string;
    tcpip: string;
    tdmpsupp: string;
    tdmptotl: string;
    timeoutint: string;
    totactvusrtr: string;
    totdelyusrtr: string;
    totltasks: string;
    totquetime: string;
    tranisolate: string;
    userstatus: string;
    vtmacbdope: string;
    vtmrplmax: string;
    vtmrplpost: string;
    vtmsoscnt: string;
    vtmstatus: string;
    xcfgroup: string;
    xmgatmxt: string;
    xmglamxt: string;
    xmglsmxt: string;
    xmgltat: string;
    xrfstatus: string;
}

export class CICSSession extends Session {

    name: string;
    regionName?: string;
    plexName?: string;

    constructor(session: ISession, profileInfo: { name: string, regionName?: string, plexName?: string; }) {
        super(session);
        this.name = profileInfo.name;
        this.regionName = profileInfo.regionName;
        this.plexName = profileInfo.plexName;
    }
}

abstract class Resource<TAttributes> {

    name: string;
    keyID: keyof TAttributes;
    attributes: TAttributes;
    criteria?: string;

    constructor(record: TAttributes) {
        this.attributes = record;
    }

    getName(): string {
        const name = `${this.attributes[this.keyID]}`;
        return name;
    }
}

class ProgramResource extends Resource<IProgram> {

    constructor(programRecord: IProgram) {
        super(programRecord);
        this.name = "CICSProgram";
        this.keyID = "program";
        this.criteria = "NOT (PROGRAM=DFH* OR PROGRAM=CEE* OR PROGRAM=EYU*)";
    }

    newCopy() {
        console.log("Do a new copy");
    }
}

class TransactionResource extends Resource<ITransaction> {

    constructor(transactionRecord: ITransaction) {
        super(transactionRecord);
        this.name = "CICSProgram";
        this.keyID = "tranid";
    }
}

class BundleResource extends Resource<IBundle> {

    constructor(bundleRecord: IBundle) {
        super(bundleRecord);
        this.name = "CICSBundle";
        this.keyID = "name";
    }
}

class BundlePartResource extends Resource<IBundlePart> {

    constructor(bundlePartRecord: IBundlePart) {
        super(bundlePartRecord);
        this.name = "CICSBundlePart";
        this.keyID = "bundlepart";
    }
}

export class RegionResource extends Resource<IRegion> {

    constructor(regionRecord: IRegion) {
        super(regionRecord);
        this.name = "CICSRegion";
        this.keyID = "applid";
    }
}


abstract class ITreeItem extends TreeItem {

    children: ITreeItem[] = [];
    abstract childGetter?: (parent: ITreeItem | ProfileTreeItem) => Promise<ITreeItem[]>;
    parent: ITreeItem | ProfileTreeItem;

    addChild(child: ITreeItem) {
        if (this.collapsibleState === TreeItemCollapsibleState.None) {
            this.collapsibleState = TreeItemCollapsibleState.Collapsed;
        }
        this.children.push(child);
    }

    async getChildren() {
        if (this.childGetter) {
            this.children = await this.childGetter(this);
            return this.children;
        }
        return [];
    }

    getSession(): CICSSession {
        return this.parent.getSession();
    }
}


export class ProfileTreeItem extends TreeItem {

    profile: IProfileLoaded;
    session: CICSSession;
    children: ITreeItem[] = [];

    constructor(profile: IProfileLoaded) {
        super(profile.name, TreeItemCollapsibleState.Collapsed);
        this.profile = profile;

        this.session = new CICSSession({
            hostname: this.profile.profile.host,
            port: this.profile.profile.port,
            user: this.profile.profile.user,
            password: this.profile.profile.password,
            protocol: this.profile.profile.protocol,
            rejectUnauthorized: this.profile.profile.rejectUnauthorized,
        }, {
            name: this.profile.name,
            regionName: this.profile.profile.regionName
        });
    }

    async getChildren() {

        const retrievedRegion = await getResource(new Session({
            hostname: this.profile.profile.host,
            port: this.profile.profile.port,
            user: this.profile.profile.user,
            password: this.profile.profile.password,
            rejectUnauthorized: this.profile.profile.rejectUnauthorized,
            protocol: this.profile.profile.protocol,
        }), {
            name: "CICSRegion",
            regionName: this.profile.profile.regionName,
        });
        let regionArr = retrievedRegion.response.records.cicsregion;
        if (!Array.isArray(regionArr)) regionArr = [regionArr];

        this.children = [];

        for (const region of regionArr) {

            const regionTreeItem: ResourceTreeItem<RegionResource> = new ResourceTreeItem(this, new RegionResource(region), async (parent: ITreeItem | ProfileTreeItem) => {
                return [
                    new ResourceTreeItem(parent, null, getPrograms, [], "Programs"),
                    new ResourceTreeItem(parent, null, getTransactions, [], "Transactions"),
                    new ResourceTreeItem(parent, null, getBundles, [], "Bundles"),
                ];
            });
            this.children.push(regionTreeItem);
        }
        return this.children;
    }
    getSession(): CICSSession {
        return this.session;
    }
    getProfile() {
        return this.profile;
    }
}

export class ResourceTreeItem<TResource extends Resource<any>> extends ITreeItem {

    childGetter?: (parent: ITreeItem | ProfileTreeItem) => Promise<ITreeItem[]>;
    resource: TResource | null;
    criteria: string | undefined = undefined;

    constructor(parent: ITreeItem | ProfileTreeItem, resource: TResource, childGetter?: (parent: ITreeItem | ProfileTreeItem) => Promise<ITreeItem[]>, children: ITreeItem[] = [], label?: string) {
        super(label || resource?.getName() || "Folder", childGetter ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None);
        this.parent = parent;
        this.children = children;
        this.resource = resource;
        this.childGetter = childGetter;
    }

    setCriteria(criteria: string) {
        this.criteria = criteria;
    }
}

export class CICSTree implements TreeDataProvider<ITreeItem | ProfileTreeItem> {

    children: ProfileTreeItem[] = [];

    constructor() {
        this.refreshLoadedProfiles();
    }

    getTreeItem(element: ITreeItem): ITreeItem {
        return element;
    }
    async getChildren(element?: ResourceTreeItem<any>): Promise<ITreeItem[] | ProfileTreeItem[]> {
        if (element) {
            return element.getChildren();
        } else {
            return this.children;
        }
    }
    addChild(tree: ProfileTreeItem) {
        this.children.push(tree);
        this.refresh();
    }
    async refreshLoadedProfiles() {
        this.children = [];
        const persistentStorage = new PersistentStorage("zowe.cics.persistent");
        await ProfileManagement.profilesCacheRefresh();
        for (const profilename of persistentStorage.getLoadedCICSProfile()) {
            const profileToLoad = ProfileManagement.getProfilesCache().loadNamedProfile(profilename, "cics");
            this.addChild(new ProfileTreeItem(profileToLoad));
        }
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    public _onDidChangeTreeData = new EventEmitter<any | undefined>();
    readonly onDidChangeTreeData: Event<any | undefined> = this._onDidChangeTreeData.event;
}

const getPrograms = async (parent: ITreeItem | ProfileTreeItem): Promise<ITreeItem[]> => {
    const retrievedPrograms = await getResource(parent.getSession(), {
        name: "CICSProgram",
        regionName: parent.getSession().regionName,
        criteria: "NOT (PROGRAM=DFH* OR PROGRAM=EYU* OR PROGRAM=CEE* OR PROGRAM=CSQ*)"
    });
    let programArr = retrievedPrograms.response.records.cicsprogram;
    if (!Array.isArray(programArr)) programArr = [programArr];
    return programArr.map((program: IProgram) => new ResourceTreeItem(parent, new ProgramResource(program)));
};

const getTransactions = async (parent: ITreeItem | ProfileTreeItem): Promise<ITreeItem[]> => {
    const retrievedTransactions = await getResource(parent.getSession(), {
        name: "CICSLocalTransaction",
        regionName: parent.getSession().regionName
    });
    let transactionArr = retrievedTransactions.response.records.cicslocaltransaction;
    if (!Array.isArray(transactionArr)) transactionArr = [transactionArr];
    return transactionArr.map((transaction: ITransaction) => new ResourceTreeItem(parent, new TransactionResource(transaction)));
};

const getBundles = async (parent: ITreeItem | ProfileTreeItem): Promise<ITreeItem[]> => {
    const retrievedBundles = await getResource(parent.getSession(), {
        name: "CICSBundle",
        regionName: parent.getSession().regionName,
    });
    let bundleArr = retrievedBundles.response.records.cicsbundle;
    if (!Array.isArray(bundleArr)) bundleArr = [bundleArr];

    return bundleArr.map((bundle: IBundle) => {
        const bundleTreeItem: ResourceTreeItem<BundleResource> = new ResourceTreeItem(
            parent,
            new BundleResource(bundle),
            (parent: ITreeItem | ProfileTreeItem) => {
                return getBundleParts(bundleTreeItem, `BUNDLE=${bundle.name}`);
            }
        );
        return bundleTreeItem;
    });
};

const getBundleParts = async (parent: ITreeItem | ProfileTreeItem, criteria?: string): Promise<ITreeItem[]> => {
    const retrievedBundleParts = await getResource(parent.getSession(), {
        name: "CICSBundlePart",
        regionName: parent.getSession().regionName,
        criteria,
    });
    let bundlePartArr = retrievedBundleParts.response.records.cicsbundlepart;
    if (!Array.isArray(bundlePartArr)) bundlePartArr = [bundlePartArr];
    return bundlePartArr.map((bundlePart: IBundlePart) => new ResourceTreeItem(parent, new BundlePartResource(bundlePart)));
};
