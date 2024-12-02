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

import { IProfileLoaded } from "@zowe/imperative";
import { commands, window } from "vscode";
import { CICSTree, ProfileTreeItem } from "../utils/V5/fix";
import { ProfileManagement } from "../utils/profileManagement";

export function getAddSessionCommand(tree: CICSTree) {
    return commands.registerCommand("cics-extension-for-zowe.addSession", async () => {

        const allCICSProfiles = ProfileManagement.getProfilesCache().getProfiles("cics");
        if (!allCICSProfiles) {
            window.showInformationMessage(`Could not find any CICS profiles`);
            return;
        }

        const createItem = { label: "\uFF0B Create New Configuration File..." };
        const editItem = { label: "\uFF0B Edit Configuration File..." };

        const profileNameToLoad = await window.showQuickPick(
            [createItem, editItem].concat(
                allCICSProfiles.map((profile: IProfileLoaded) => {
                    return { label: profile.name };
                })
            ),
            {
                ignoreFocusOut: true,
                placeHolder: "Load Profile or Create New Profile",
            }
        );

        if (!profileNameToLoad) {
            window.showInformationMessage("No profile selected. Cancelling");
            return;
        }

        if (profileNameToLoad === createItem) {
            window.showInformationMessage("Creating new zowe config file");
            return;
        }
        if (profileNameToLoad === editItem) {
            window.showInformationMessage("Editing current zowe config file");
            return;
        }

        const profile = ProfileManagement.getProfilesCache().loadNamedProfile(profileNameToLoad.label, "cics");

        tree.addChild(new ProfileTreeItem(profile));
        tree.refresh();
    });
}
