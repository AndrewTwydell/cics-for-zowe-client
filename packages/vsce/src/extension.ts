/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */
import { commands as cmds, ExtensionContext, Hover, languages, ProgressLocation, TreeItemCollapsibleState, window } from "vscode";

import axios from 'axios';
import commands from "./commands";
import { CICSSessionTree } from "./trees/CICSSessionTree";
import { CICSTree } from "./trees/CICSTree";
import { plexExpansionHandler, regionContainerExpansionHandler, sessionExpansionHandler } from "./utils/expansionHandler";
import { getIconPathInResources, setIconClosed } from "./utils/profileUtils";

/**
 * Initializes the extension
 * @param context
 * @returns
 */
export async function activate(context: ExtensionContext) {
  const zeVersion = getZoweExplorerVersion();
  const logger = Logger.getAppLogger();
  let treeDataProv: CICSTree = null;
  if (!zeVersion) {
    window.showErrorMessage("Zowe Explorer was not found: Please ensure Zowe Explorer v2.0.0 or higher is installed");
    return;
  } else if (zeVersion[0] !== "3") {
    window.showErrorMessage(`Current version of Zowe Explorer is ${zeVersion}. Please ensure Zowe Explorer v3.0.0 or higher is installed`);
    return;
  }
  if (ProfileManagement.apiDoesExist()) {
    try {
      // Register 'cics' profiles as a ZE extender
      await ProfileManagement.registerCICSProfiles();
      ProfileManagement.getProfilesCache().registerCustomProfilesType("cics");
      const apiRegister = await ProfileManagement.getExplorerApis();
      await apiRegister.getExplorerExtenderApi().reloadProfiles();
      if (apiRegister.onProfilesUpdate) {
        apiRegister.onProfilesUpdate(async () => {
          await treeDataProv.refreshLoadedProfiles();
        });
      }
      logger.debug("Zowe Explorer was modified for the CICS Extension.");
    } catch (error) {
      console.log(error);
      logger.error("IBM CICS for Zowe Explorer was not initialized correctly");
      return;
    }
  } else {
    window.showErrorMessage(
      "Zowe Explorer was not found: either it is not installed or you are using an older version without extensibility API. Please ensure Zowe Explorer v2.0.0-next.202202221200 or higher is installed"
    );
    return;
  }

  treeDataProv = new CICSTree();
  const treeview = window.createTreeView("cics-view", {
    treeDataProvider: treeDataProv,
    showCollapseAll: true,
    canSelectMany: true,
  });

  treeview.onDidExpandElement(async (node) => {
    // Profile node expanded
    if (node.element.contextValue.includes("cicssession.")) {
      try {
        await sessionExpansionHandler(node.element, treeDataProv);
      } catch (error) {
        console.log(error);
      }
      // Plex node expanded
    } else if (node.element.contextValue.includes("cicsplex.")) {
      try {
        await plexExpansionHandler(node.element, treeDataProv);
      } catch (error) {
        console.log(error);
        const newSessionTree = new CICSSessionTree(
          node.element.getParent().profile,
          getIconPathInResources("profile-disconnected-dark.svg", "profile-disconnected-light.svg")
        );
        treeDataProv.loadedProfiles.splice(treeDataProv.getLoadedProfiles().indexOf(node.element.getParent()), 1, newSessionTree);
        treeDataProv._onDidChangeTreeData.fire(undefined);
      }
      // Region node expanded
    } else if (node.element.contextValue.includes("cicsregion.")) {
      // Web folder node expanded
    } else if (node.element.contextValue.includes("cicstreeweb.")) {
      window.withProgress(
        {
          title: "Loading Resources",
          location: ProgressLocation.Notification,
          cancellable: false,
        },
        async (_, token) => {
          token.onCancellationRequested(() => {
            console.log("Cancelling the loading of resources");
          });
          await node.element.loadContents();
          treeDataProv._onDidChangeTreeData.fire(undefined);
        }
      );
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;
      // Programs folder node expanded
    } else if (node.element.contextValue.includes("cicstreeprogram.")) {
      window.withProgress(
        {
          title: "Loading Programs",
          location: ProgressLocation.Notification,
          cancellable: false,
        },
        async (_, token) => {
          token.onCancellationRequested(() => {
            console.log("Cancelling the loading of programs");
          });
          await node.element.loadContents();
          treeDataProv._onDidChangeTreeData.fire(undefined);
        }
      );
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // Transaction folder node expanded
    } else if (node.element.contextValue.includes("cicstreetransaction.")) {
      window.withProgress(
        {
          title: "Loading Transactions",
          location: ProgressLocation.Notification,
          cancellable: false,
        },
        async (_, token) => {
          token.onCancellationRequested(() => {
            console.log("Cancelling the loading of transactions");
          });
          await node.element.loadContents();
          treeDataProv._onDidChangeTreeData.fire(undefined);
        }
      );
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // Local file folder node expanded
    } else if (node.element.contextValue.includes("cicstreelocalfile.")) {
      window.withProgress(
        {
          title: "Loading Local Files",
          location: ProgressLocation.Notification,
          cancellable: false,
        },
        async (_, token) => {
          token.onCancellationRequested(() => {
            console.log("Cancelling the loading of local files");
          });
          await node.element.loadContents();
          treeDataProv._onDidChangeTreeData.fire(undefined);
        }
      );
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // Task folder node expanded
    } else if (node.element.contextValue.includes("cicstreetask.")) {
      window.withProgress(
        {
          title: "Loading Tasks",
          location: ProgressLocation.Notification,
          cancellable: false,
        },
        async (_, token) => {
          token.onCancellationRequested(() => {
            console.log("Cancelling the loading of tasks");
          });
          await node.element.loadContents();
          treeDataProv._onDidChangeTreeData.fire(undefined);
        }
      );
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // Library folder node expanded
    } else if (node.element.contextValue.includes("cicstreelibrary.")) {
      window.withProgress(
        {
          title: "Loading Libraries",
          location: ProgressLocation.Notification,
          cancellable: false,
        },
        async () => {
          await node.element.loadContents();
          treeDataProv._onDidChangeTreeData.fire(undefined);
        }
      );
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // Library tree item node expanded to view datasets
    } else if (node.element.contextValue.includes("cicslibrary.")) {
      window.withProgress(
        {
          title: "Loading Datasets",
          location: ProgressLocation.Notification,
          cancellable: false,
        },
        async () => {
          await node.element.loadContents();
          treeDataProv._onDidChangeTreeData.fire(undefined);
        }
      );
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // Dataset node expanded
    } else if (node.element.contextValue.includes("cicsdatasets.")) {
      window.withProgress(
        {
          title: "Loading Programs",
          location: ProgressLocation.Notification,
          cancellable: false,
        },
        async () => {
          await node.element.loadContents();
          treeDataProv._onDidChangeTreeData.fire(undefined);
        }
      );
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // TCPIP folder node expanded
    } else if (node.element.contextValue.includes("cicstreetcpips.")) {
      window.withProgress(
        {
          title: "Loading TCPIP Services",
          location: ProgressLocation.Notification,
          cancellable: false,
        },
        async (_, token) => {
          token.onCancellationRequested(() => {
            console.log("Cancelling the loading of TCPIP services");
          });
          await node.element.loadContents();
          treeDataProv._onDidChangeTreeData.fire(undefined);
        }
      );
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // Web Services folder node expanded
    } else if (node.element.contextValue.includes("cicstreewebservice.")) {
      window.withProgress(
        {
          title: "Loading Web Services",
          location: ProgressLocation.Notification,
          cancellable: false,
        },
        async (_, token) => {
          token.onCancellationRequested(() => {
            console.log("Cancelling the loading of Web Services");
          });
          await node.element.loadContents();
          treeDataProv._onDidChangeTreeData.fire(undefined);
        }
      );
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // Pipeline folder node expanded
    } else if (node.element.contextValue.includes("cicstreepipeline.")) {
      window.withProgress(
        {
          title: "Loading Pipeline",
          location: ProgressLocation.Notification,
          cancellable: false,
        },
        async (_, token) => {
          token.onCancellationRequested(() => {
            console.log("Cancelling the loading of Pipelines");
          });
          await node.element.loadContents();
          treeDataProv._onDidChangeTreeData.fire(undefined);
        }
      );
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // URIMap folder node expanded
    } else if (node.element.contextValue.includes("cicstreeurimaps.")) {
      window.withProgress(
        {
          title: "Loading URIMaps",
          location: ProgressLocation.Notification,
          cancellable: false,
        },
        async (_, token) => {
          token.onCancellationRequested(() => {
            console.log("Cancelling the loading of URIMaps");
          });
          await node.element.loadContents();
          treeDataProv._onDidChangeTreeData.fire(undefined);
        }
      );
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // All programs folder node expanded
    } else if (node.element.contextValue.includes("cicscombinedprogramtree.")) {
      // Children only loaded if filter has been applied
      if (node.element.getActiveFilter()) {
        await node.element.loadContents(treeDataProv);
      }
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // All transactions folder node expanded
    } else if (node.element.contextValue.includes("cicscombinedtransactiontree.")) {
      if (node.element.getActiveFilter()) {
        await node.element.loadContents(treeDataProv);
      }
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // All local files folder node expanded
    } else if (node.element.contextValue.includes("cicscombinedlocalfiletree.")) {
      if (node.element.getActiveFilter()) {
        await node.element.loadContents(treeDataProv);
      }
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // All tasks folder node expanded
    } else if (node.element.contextValue.includes("cicscombinedtasktree.")) {
      if (node.element.getActiveFilter()) {
        await node.element.loadContents(treeDataProv);
      }
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;
    }

    // All libraries folder node expanded
    else if (node.element.contextValue.includes("cicscombinedlibrarytree.")) {
      if (node.element.getActiveFilter()) {
        await node.element.loadContents(treeDataProv);
      }
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;
    }

    // All TCPIP Services node expanded
    else if (node.element.contextValue.includes("cicscombinedtcpipstree.")) {
      if (node.element.getActiveFilter()) {
        await node.element.loadContents(treeDataProv);
      }
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;
    }

    // All URI Maps node expanded
    else if (node.element.contextValue.includes("cicscombinedurimapstree.")) {
      if (node.element.getActiveFilter()) {
        await node.element.loadContents(treeDataProv);
      }
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // All Pipeline folder node expanded
    } else if (node.element.contextValue.includes("cicscombinedpipelinetree.")) {
      if (node.element.getActiveFilter()) {
        await node.element.loadContents(treeDataProv);
      }
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // All Web Services folder node expanded
    } else if (node.element.contextValue.includes("cicscombinedwebservicetree.")) {
      if (node.element.getActiveFilter()) {
        await node.element.loadContents(treeDataProv);
      }
      node.element.collapsibleState = TreeItemCollapsibleState.Expanded;

      // Regions container folder node expanded
    } else if (node.element.contextValue.includes("cicsregionscontainer.")) {
      node.element.iconPath = getIconPathInResources("folder-open-dark.svg", "folder-open-light.svg");
      await regionContainerExpansionHandler(node.element, treeDataProv);
      treeDataProv._onDidChangeTreeData.fire(undefined);
    }
  });

  treeview.onDidCollapseElement((node) => {
    if (node.element.contextValue.includes("cicsregionscontainer.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicscombinedprogramtree.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicscombinedtransactiontree.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicscombinedlocalfiletree.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicscombinedtasktree.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicscombinedlibrarytree.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicscombinedtcpipstree.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicscombinedurimapstree.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicscombinedpipelinetree.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicscombinedwebservicetree.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicstreeprogram.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicstreetransaction.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicstreelocalfile.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicstreetask.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicstreelibrary.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicslibrary.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicstreeweb.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicstreetcpips.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicstreepipeline.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicstreewebservice.")) {
      setIconClosed(node, treeDataProv);
    } else if (node.element.contextValue.includes("cicstreeurimaps.")) {
      setIconClosed(node, treeDataProv);
    }
    node.element.collapsibleState = TreeItemCollapsibleState.Collapsed;
  });

  context.subscriptions.push(
    commands.getAddSessionCommand(treeDataProv),
    commands.getRemoveSessionCommand(treeDataProv, treeview),
    commands.getUpdateSessionCommand(treeDataProv, treeview),
    commands.getDeleteSessionCommand(treeDataProv, treeview),

    commands.getRefreshCommand(treeDataProv),

    commands.getNewCopyCommand(treeDataProv, treeview),
    commands.getPhaseInCommand(treeDataProv, treeview),

    commands.getEnableProgramCommand(treeDataProv, treeview),
    commands.getDisableProgramCommand(treeDataProv, treeview),
    commands.getEnableTransactionCommand(treeDataProv, treeview),
    commands.getDisableTransactionCommand(treeDataProv, treeview),
    commands.getEnableLocalFileCommand(treeDataProv, treeview),
    commands.getDisableLocalFileCommand(treeDataProv, treeview),

    commands.getCloseLocalFileCommand(treeDataProv, treeview),
    commands.getOpenLocalFileCommand(treeDataProv, treeview),

    commands.getPurgeTaskCommand(treeDataProv, treeview),

    commands.showAttributesCommand.getShowRegionAttributes(treeview),
    commands.showAttributesCommand.getShowProgramAttributesCommand(treeview),
    commands.showAttributesCommand.getShowLibraryAttributesCommand(treeview),
    commands.showAttributesCommand.getShowLibraryDatasetsAttributesCommand(treeview),
    commands.showAttributesCommand.getShowTCPIPServiceAttributesCommand(treeview),
    commands.showAttributesCommand.getShowURIMapAttributesCommand(treeview),
    commands.showAttributesCommand.getShowTransactionAttributesCommand(treeview),
    commands.showAttributesCommand.getShowLocalFileAttributesCommand(treeview),
    commands.showAttributesCommand.getShowTaskAttributesCommand(treeview),
    commands.showAttributesCommand.getShowPipelineAttributesCommand(treeview),
    commands.showAttributesCommand.getShowWebServiceAttributesCommand(treeview),

    commands.getShowRegionSITParametersCommand(treeview),

    commands.filterResourceCommands.getFilterProgramsCommand(treeDataProv, treeview),
    commands.filterResourceCommands.getFilterDatasetProgramsCommand(treeDataProv, treeview),
    commands.filterResourceCommands.getFilterLibrariesCommand(treeDataProv, treeview),
    commands.filterResourceCommands.getFilterDatasetsCommand(treeDataProv, treeview),
    commands.filterResourceCommands.getFilterTransactionCommand(treeDataProv, treeview),
    commands.filterResourceCommands.getFilterLocalFilesCommand(treeDataProv, treeview),
    commands.filterResourceCommands.getFilterTasksCommand(treeDataProv, treeview),
    commands.filterResourceCommands.getFilterTCPIPSCommand(treeDataProv, treeview),
    commands.filterResourceCommands.getFilterURIMapsCommand(treeDataProv, treeview),
    commands.filterResourceCommands.getFilterPipelinesCommand(treeDataProv, treeview),
    commands.filterResourceCommands.getFilterWebServicesCommand(treeDataProv, treeview),

    commands.filterAllResourceCommand.getFilterAllProgramsCommand(treeDataProv, treeview),
    commands.filterAllResourceCommand.getFilterAllLibrariesCommand(treeDataProv, treeview),
    commands.filterAllResourceCommand.getFilterAllWebServicesCommand(treeDataProv, treeview),
    commands.filterAllResourceCommand.getFilterAllPipelinesCommand(treeDataProv, treeview),
    commands.filterAllResourceCommand.getFilterAllTransactionsCommand(treeDataProv, treeview),
    commands.filterAllResourceCommand.getFilterAllLocalFilesCommand(treeDataProv, treeview),
    commands.filterAllResourceCommand.getFilterAllTasksCommand(treeDataProv, treeview),
    commands.filterAllResourceCommand.getFilterAllTCPIPServicesCommand(treeDataProv, treeview),
    commands.filterAllResourceCommand.getFilterAllURIMapsCommand(treeDataProv, treeview),

    commands.getFilterPlexResources(treeDataProv, treeview),

    commands.getClearResourceFilterCommand(treeDataProv, treeview),
    commands.getClearPlexFilterCommand(treeDataProv, treeview),

    commands.viewMoreCommand(treeDataProv, treeview),

    commands.getInquireTransactionCommand(treeDataProv, treeview),
    commands.getInquireProgramCommand(treeDataProv, treeview),

    languages.registerHoverProvider('cobol', {
      async provideHover(document, position, token) {
        const text = document.getText();
        const hoverPositionOffset = document.offsetAt(position);
        const regex = /(?:WRITEQ|READQ)\s+TS\s+QUEUE\(\s*([^)]+?)\s*\)/g;


        let match: any = null;
        let output = null;
        while ((match = regex.exec(text)) !== null) {
          const command = match[0].startsWith("WRITEQ") ? "WRITEQ TS QUEUE" : "READQ TS QUEUE";
          const queueName = match[1].trim();
          const startOffset = match.index;
          const endOffset = regex.lastIndex;

          if (hoverPositionOffset >= startOffset && hoverPositionOffset <= endOffset) {
            output = { command, queueName };
          }
        }

        if (output) {
          const { command, queueName } = output;

            // Hit servlet to get TSQ content
          const res = await axios.get(`CMCI ENDPOINT /read?queue=${queueName.replaceAll("'", "")}`);

          console.log(res.data);

          if (res.data && res.data.content) {
            window.showInformationMessage(res.data.content.join(", "));
            return new Hover(
              [
                `# ${queueName.replaceAll("'", "")}`,
                ...res.data.content.map((item: string) => `- ${item.trim()}`)
              ]
            );
          }
          return new Hover(
            [
              `# ${queueName}`,
              `Not found!`
            ]
          );
        }

        return null;
      }
    })
  );


  const inquireQueue = cmds.registerCommand('cics-extension-for-zowe.tsq', async () => {
    const editor = window.activeTextEditor;
    if (!editor) {
      return;
    }
    const selection = editor.selection;
    const text = editor.document.getText(selection);

    const queueName = text.toUpperCase().replaceAll(" ", "").split("QUEUE(")[1].split(")")[0].replaceAll("'", "").replaceAll("\"", "");

    window.showInformationMessage(`Inquired queue for: ${queueName}`);

    // CMCI Endpoint to get TSQ content
    const res = await axios.get(`CMCI ENDPOINT /read?queue=${queueName}`);

    if (res.data && res.data.content) {
      window.showInformationMessage(res.data.content.join(", "));
    }


  });
  context.subscriptions.push(inquireQueue);

  const updateContextKey = () => {
    const editor = window.activeTextEditor;
    if (!editor) {
      cmds.executeCommand('setContext', 'editorHasWriteQTS', false);
      return;
    }
    const text = editor.document.getText(editor.selection);
    const hasWriteQTS = text.replaceAll("\n", "").replaceAll("\t", "").replaceAll(" ", "").includes('TSQUEUE(');
    cmds.executeCommand('setContext', 'editorHasWriteQTS', hasWriteQTS);
  };

  window.onDidChangeTextEditorSelection(updateContextKey, null, context.subscriptions);
  window.onDidChangeActiveTextEditor(updateContextKey, null, context.subscriptions);
  updateContextKey();
}

export function deactivate(context: ExtensionContext): void {
  return;
}
