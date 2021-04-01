import { CompositeDisposable, CursorPositionChangedEvent } from "atom"
import { StatusBar } from "atom/status-bar"

import { OutlineProvider, OutlineTree } from "atom-ide-base"
import { ProviderRegistry } from "atom-ide-base/commons-atom/ProviderRegistry"

import { OutlineStatusView } from "./outline-status-view"

const subscriptions = new CompositeDisposable()
export const providerRegistry = new ProviderRegistry<OutlineProvider>()

let editor_subscriptions: CompositeDisposable | null
let outlineStatusView: OutlineStatusView | null
let statusBar: StatusBar | null

export function activate() {
    outlineStatusView = new OutlineStatusView()

    // Register config monitors
    subscriptions.add(atom.config.onDidChange("atom-ide-statusbar.statusbarPriority", (values) => {
        outlineStatusView?.unmount()

        if (statusBar) {
            outlineStatusView?.mount(statusBar, values.newValue)
        }
    }))

    // Register command that toggles this view
    subscriptions.add(atom.workspace.observeActivePaneItem(() => {
        unsubscribeLastActiveEditor()
        subscribeToActiveEditor()

        toggle()
    }))
}

export function deactivate() {
    unsubscribeLastActiveEditor()
    subscriptions.dispose()

    outlineStatusView?.destroy()
    outlineStatusView = null

    statusBar = null
}

export function consumeStatusBar(sb: StatusBar) {
    statusBar = sb

    const priority = atom.config.get("atom-ide-statusbar.statusbarPriority")
    outlineStatusView?.mount(statusBar, priority)
}


export function consumeOutlineProvider(provider: OutlineProvider) {
    subscriptions.add(providerRegistry.addProvider(provider))
}

function subscribeToActiveEditor() {
    const editor = atom.workspace.getActiveTextEditor()
    if (editor === undefined) {
        return
    }

    editor_subscriptions = new CompositeDisposable()

    editor_subscriptions.add(editor.onDidChangeCursorPosition((evt: CursorPositionChangedEvent) => {
        if (evt.oldBufferPosition.row == evt.newBufferPosition.row) {
            return
        }

        toggle()
    }))

    editor_subscriptions.add(editor.onDidSave(() => {
        toggle()
    }))
}

function unsubscribeLastActiveEditor() {
    editor_subscriptions?.dispose()
    editor_subscriptions = null
}

async function toggle() {
    const editor = atom.workspace.getActiveTextEditor()
    if (editor === undefined) {
        outlineStatusView?.clear()
        return
    }

    if (editor.getPath() === undefined) {
        outlineStatusView?.clear()
        return
    }

    outlineStatusView?.clear()

    const provider = providerRegistry.getProviderForEditor(editor)
    const outline = await provider?.getOutline(editor)
    if (outline?.outlineTrees === undefined) {
        return
    }

    const show_outer = atom.config.get("atom-ide-statusbar.outerScope")
    const current_row = editor.getCursorBufferPosition().row

    // Start a depth first search looking for the tree covering current row:
    const stack: OutlineTree[] = outline.outlineTrees
    while (stack.length > 0) {
        const tree = stack.pop()
        if (tree!.startPosition.row <= current_row && current_row <= (tree?.endPosition?.row ?? current_row)) {
            if (show_outer || tree!.startPosition.row == current_row) {
                outlineStatusView?.addText((tree!.representativeName || tree!.plainText) ?? "")
            }

            if (tree!.children.length == 0) {
                // We're now at the leaf node of the tree covering the current line,
                // there is no value to continue the DFS on other silbling trees.
                break
            }

            for (let i = 0; i < tree!.children.length; i++) {
                stack.push(tree!.children[i])
            }
        }
    }
}

export { default as config } from "./config.json"
