"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.consumeOutlineProvider = exports.consumeStatusBar = exports.deactivate = exports.activate = exports.providerRegistry = void 0;
const atom_1 = require("atom");
const ProviderRegistry_1 = require("atom-ide-base/commons-atom/ProviderRegistry");
const outline_status_view_1 = require("./outline-status-view");
const subscriptions = new atom_1.CompositeDisposable();
exports.providerRegistry = new ProviderRegistry_1.ProviderRegistry();
let editor_subscriptions;
let outlineStatusView;
let statusBar;
function activate() {
    outlineStatusView = new outline_status_view_1.OutlineStatusView();
    subscriptions.add(atom.config.onDidChange("atom-ide-statusbar.statusbarPriority", (values) => {
        outlineStatusView === null || outlineStatusView === void 0 ? void 0 : outlineStatusView.unmount();
        if (statusBar) {
            outlineStatusView === null || outlineStatusView === void 0 ? void 0 : outlineStatusView.mount(statusBar, values.newValue);
        }
    }));
    subscriptions.add(atom.workspace.observeActivePaneItem(() => {
        unsubscribeLastActiveEditor();
        subscribeToActiveEditor();
        toggle();
    }));
}
exports.activate = activate;
function deactivate() {
    unsubscribeLastActiveEditor();
    subscriptions.dispose();
    outlineStatusView === null || outlineStatusView === void 0 ? void 0 : outlineStatusView.destroy();
    outlineStatusView = null;
    statusBar = null;
}
exports.deactivate = deactivate;
function consumeStatusBar(sb) {
    statusBar = sb;
    const priority = atom.config.get("atom-ide-statusbar.statusbarPriority");
    outlineStatusView === null || outlineStatusView === void 0 ? void 0 : outlineStatusView.mount(statusBar, priority);
}
exports.consumeStatusBar = consumeStatusBar;
function consumeOutlineProvider(provider) {
    subscriptions.add(exports.providerRegistry.addProvider(provider));
}
exports.consumeOutlineProvider = consumeOutlineProvider;
function subscribeToActiveEditor() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor === undefined) {
        return;
    }
    editor_subscriptions = new atom_1.CompositeDisposable();
    editor_subscriptions.add(editor.onDidChangeCursorPosition((evt) => {
        if (evt.oldBufferPosition.row == evt.newBufferPosition.row) {
            return;
        }
        toggle();
    }));
    editor_subscriptions.add(editor.onDidSave(() => {
        toggle();
    }));
}
function unsubscribeLastActiveEditor() {
    editor_subscriptions === null || editor_subscriptions === void 0 ? void 0 : editor_subscriptions.dispose();
    editor_subscriptions = null;
}
async function toggle() {
    var _a, _b, _c;
    const editor = atom.workspace.getActiveTextEditor();
    if (editor === undefined) {
        outlineStatusView === null || outlineStatusView === void 0 ? void 0 : outlineStatusView.clear();
        return;
    }
    if (editor.getPath() === undefined) {
        outlineStatusView === null || outlineStatusView === void 0 ? void 0 : outlineStatusView.clear();
        return;
    }
    outlineStatusView === null || outlineStatusView === void 0 ? void 0 : outlineStatusView.clear();
    const provider = exports.providerRegistry.getProviderForEditor(editor);
    const outline = await (provider === null || provider === void 0 ? void 0 : provider.getOutline(editor));
    if ((outline === null || outline === void 0 ? void 0 : outline.outlineTrees) === undefined) {
        return;
    }
    const show_outer = atom.config.get("atom-ide-statusbar.outerScope");
    const current_row = editor.getCursorBufferPosition().row;
    const stack = outline.outlineTrees;
    while (stack.length > 0) {
        const tree = stack.pop();
        if (tree.startPosition.row <= current_row && current_row <= ((_b = (_a = tree === null || tree === void 0 ? void 0 : tree.endPosition) === null || _a === void 0 ? void 0 : _a.row) !== null && _b !== void 0 ? _b : current_row)) {
            if (show_outer || tree.startPosition.row == current_row) {
                outlineStatusView === null || outlineStatusView === void 0 ? void 0 : outlineStatusView.addText((_c = (tree.representativeName || tree.plainText)) !== null && _c !== void 0 ? _c : "");
            }
            for (let i = 0; i < tree.children.length; i++) {
                stack.push(tree.children[i]);
            }
        }
    }
}
var config_json_1 = require("./config.json");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return __importDefault(config_json_1).default; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtCQUFzRTtBQUl0RSxrRkFBOEU7QUFFOUUsK0RBQXlEO0FBRXpELE1BQU0sYUFBYSxHQUFHLElBQUksMEJBQW1CLEVBQUUsQ0FBQTtBQUNsQyxRQUFBLGdCQUFnQixHQUFHLElBQUksbUNBQWdCLEVBQW1CLENBQUE7QUFFdkUsSUFBSSxvQkFBZ0QsQ0FBQTtBQUNwRCxJQUFJLGlCQUEyQyxDQUFBO0FBQy9DLElBQUksU0FBMkIsQ0FBQTtBQUUvQixTQUFnQixRQUFRO0lBQ3BCLGlCQUFpQixHQUFHLElBQUksdUNBQWlCLEVBQUUsQ0FBQTtJQUczQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLHNDQUFzQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7UUFDekYsaUJBQWlCLGFBQWpCLGlCQUFpQix1QkFBakIsaUJBQWlCLENBQUUsT0FBTyxFQUFFLENBQUE7UUFFNUIsSUFBSSxTQUFTLEVBQUU7WUFDWCxpQkFBaUIsYUFBakIsaUJBQWlCLHVCQUFqQixpQkFBaUIsQ0FBRSxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUN2RDtJQUNMLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFHSCxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsR0FBRyxFQUFFO1FBQ3hELDJCQUEyQixFQUFFLENBQUE7UUFDN0IsdUJBQXVCLEVBQUUsQ0FBQTtRQUV6QixNQUFNLEVBQUUsQ0FBQTtJQUNaLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDUCxDQUFDO0FBbkJELDRCQW1CQztBQUVELFNBQWdCLFVBQVU7SUFDdEIsMkJBQTJCLEVBQUUsQ0FBQTtJQUM3QixhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7SUFF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R3hELE1BQU0sS0FBSyxHQUFrQixPQUFPLENBQUMsWUFBWSxDQUFBO0lBQ2pELE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDckIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3hCLElBQUksSUFBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksV0FBVyxJQUFJLFdBQVcsSUFBSSxDQUFDLE1BQUEsTUFBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsV0FBVywwQ0FBRSxHQUFHLG1DQUFJLFdBQVcsQ0FBQyxFQUFFO1lBQ2xHLElBQUksVUFBVSxJQUFJLElBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLFdBQVcsRUFBRTtnQkFDdEQsaUJBQWlCLGFBQWpCLGlCQUFpQix1QkFBakIsaUJBQWlCLENBQUUsT0FBTyxDQUFDLE1BQUEsQ0FBQyxJQUFLLENBQUMsa0JBQWtCLElBQUksSUFBSyxDQUFDLFNBQVMsQ0FBQyxtQ0FBSSxFQUFFLENBQUMsQ0FBQTthQUNsRjtZQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDNUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDaEM7U0FDSjtLQUNKO0FBQ0wsQ0FBQztBQUVELDZDQUFpRDtBQUF4QyxzSEFBQSxPQUFPLE9BQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBDdXJzb3JQb3NpdGlvbkNoYW5nZWRFdmVudCB9IGZyb20gXCJhdG9tXCJcbmltcG9ydCB7IFN0YXR1c0JhciB9IGZyb20gXCJhdG9tL3N0YXR1cy1iYXJcIlxuXG5pbXBvcnQgeyBPdXRsaW5lUHJvdmlkZXIsIE91dGxpbmVUcmVlIH0gZnJvbSBcImF0b20taWRlLWJhc2VcIlxuaW1wb3J0IHsgUHJvdmlkZXJSZWdpc3RyeSB9IGZyb20gXCJhdG9tLWlkZS1iYXNlL2NvbW1vbnMtYXRvbS9Qcm92aWRlclJlZ2lzdHJ5XCJcblxuaW1wb3J0IHsgT3V0bGluZVN0YXR1c1ZpZXcgfSBmcm9tIFwiLi9vdXRsaW5lLXN0YXR1cy12aWV3XCJcblxuY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbmV4cG9ydCBjb25zdCBwcm92aWRlclJlZ2lzdHJ5ID0gbmV3IFByb3ZpZGVyUmVnaXN0cnk8T3V0bGluZVByb3ZpZGVyPigpXG5cbmxldCBlZGl0b3Jfc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZSB8IG51bGxcbmxldCBvdXRsaW5lU3RhdHVzVmlldzogT3V0bGluZVN0YXR1c1ZpZXcgfCBudWxsXG5sZXQgc3RhdHVzQmFyOiBTdGF0dXNCYXIgfCBudWxsXG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICBvdXRsaW5lU3RhdHVzVmlldyA9IG5ldyBPdXRsaW5lU3RhdHVzVmlldygpXG5cbiAgICAvLyBSZWdpc3RlciBjb25maWcgbW9uaXRvcnNcbiAgICBzdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShcImF0b20taWRlLXN0YXR1c2Jhci5zdGF0dXNiYXJQcmlvcml0eVwiLCAodmFsdWVzKSA9PiB7XG4gICAgICAgIG91dGxpbmVTdGF0dXNWaWV3Py51bm1vdW50KClcblxuICAgICAgICBpZiAoc3RhdHVzQmFyKSB7XG4gICAgICAgICAgICBvdXRsaW5lU3RhdHVzVmlldz8ubW91bnQoc3RhdHVzQmFyLCB2YWx1ZXMubmV3VmFsdWUpXG4gICAgICAgIH1cbiAgICB9KSlcblxuICAgIC8vIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIHN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVQYW5lSXRlbSgoKSA9PiB7XG4gICAgICAgIHVuc3Vic2NyaWJlTGFzdEFjdGl2ZUVkaXRvcigpXG4gICAgICAgIHN1YnNjcmliZVRvQWN0aXZlRWRpdG9yKClcblxuICAgICAgICB0b2dnbGUoKVxuICAgIH0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgICB1bnN1YnNjcmliZUxhc3RBY3RpdmVFZGl0b3IoKVxuICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbiAgICBvdXRsaW5lU3RhdHVzVmlldz8uZGVzdHJveSgpXG4gICAgb3V0bGluZVN0YXR1c1ZpZXcgPSBudWxsXG5cbiAgICBzdGF0dXNCYXIgPSBudWxsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lU3RhdHVzQmFyKHNiOiBTdGF0dXNCYXIpIHtcbiAgICBzdGF0dXNCYXIgPSBzYlxuXG4gICAgY29uc3QgcHJpb3JpdHkgPSBhdG9tLmNvbmZpZy5nZXQoXCJhdG9tLWlkZS1zdGF0dXNiYXIuc3RhdHVzYmFyUHJpb3JpdHlcIilcbiAgICBvdXRsaW5lU3RhdHVzVmlldz8ubW91bnQoc3RhdHVzQmFyLCBwcmlvcml0eSlcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3VtZU91dGxpbmVQcm92aWRlcihwcm92aWRlcjogT3V0bGluZVByb3ZpZGVyKSB7XG4gICAgc3Vic2NyaXB0aW9ucy5hZGQocHJvdmlkZXJSZWdpc3RyeS5hZGRQcm92aWRlcihwcm92aWRlcikpXG59XG5cbmZ1bmN0aW9uIHN1YnNjcmliZVRvQWN0aXZlRWRpdG9yKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmIChlZGl0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBlZGl0b3Jfc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIGVkaXRvcl9zdWJzY3JpcHRpb25zLmFkZChlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbigoZXZ0OiBDdXJzb3JQb3NpdGlvbkNoYW5nZWRFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZ0Lm9sZEJ1ZmZlclBvc2l0aW9uLnJvdyA9PSBldnQubmV3QnVmZmVyUG9zaXRpb24ucm93KSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZSgpXG4gICAgfSkpXG5cbiAgICBlZGl0b3Jfc3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLm9uRGlkU2F2ZSgoKSA9PiB7XG4gICAgICAgIHRvZ2dsZSgpXG4gICAgfSkpXG59XG5cbmZ1bmN0aW9uIHVuc3Vic2NyaWJlTGFzdEFjdGl2ZUVkaXRvcigpIHtcbiAgICBlZGl0b3Jfc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgZWRpdG9yX3N1YnNjcmlwdGlvbnMgPSBudWxsXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRvZ2dsZSgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoZWRpdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb3V0bGluZVN0YXR1c1ZpZXc/LmNsZWFyKClcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKGVkaXRvci5nZXRQYXRoKCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvdXRsaW5lU3RhdHVzVmlldz8uY2xlYXIoKVxuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBvdXRsaW5lU3RhdHVzVmlldz8uY2xlYXIoKVxuXG4gICAgY29uc3QgcHJvdmlkZXIgPSBwcm92aWRlclJlZ2lzdHJ5LmdldFByb3ZpZGVyRm9yRWRpdG9yKGVkaXRvcilcbiAgICBjb25zdCBvdXRsaW5lID0gYXdhaXQgcHJvdmlkZXI/LmdldE91dGxpbmUoZWRpdG9yKVxuICAgIGlmIChvdXRsaW5lPy5vdXRsaW5lVHJlZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBzaG93X291dGVyID0gYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1pZGUtc3RhdHVzYmFyLm91dGVyU2NvcGVcIilcbiAgICBjb25zdCBjdXJyZW50X3JvdyA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvd1xuXG4gICAgLy8gU3RhcnQgYSBkZXB0aCBmaXJzdCBzZWFyY2ggbG9va2luZyBmb3IgdGhlIHRyZWUgY292ZXJpbmcgY3VycmVudCByb3c6XG4gICAgY29uc3Qgc3RhY2s6IE91dGxpbmVUcmVlW10gPSBvdXRsaW5lLm91dGxpbmVUcmVlc1xuICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHRyZWUgPSBzdGFjay5wb3AoKVxuICAgICAgICBpZiAodHJlZSEuc3RhcnRQb3NpdGlvbi5yb3cgPD0gY3VycmVudF9yb3cgJiYgY3VycmVudF9yb3cgPD0gKHRyZWU/LmVuZFBvc2l0aW9uPy5yb3cgPz8gY3VycmVudF9yb3cpKSB7XG4gICAgICAgICAgICBpZiAoc2hvd19vdXRlciB8fCB0cmVlIS5zdGFydFBvc2l0aW9uLnJvdyA9PSBjdXJyZW50X3Jvdykge1xuICAgICAgICAgICAgICAgIG91dGxpbmVTdGF0dXNWaWV3Py5hZGRUZXh0KCh0cmVlIS5yZXByZXNlbnRhdGl2ZU5hbWUgfHwgdHJlZSEucGxhaW5UZXh0KSA/PyBcIlwiKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyZWUhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh0cmVlIS5jaGlsZHJlbltpXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBjb25maWcgfSBmcm9tIFwiLi9jb25maWcuanNvblwiXG4iXX0=