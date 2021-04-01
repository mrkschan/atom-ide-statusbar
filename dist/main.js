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
            if (tree.children.length == 0) {
                break;
            }
            for (let i = 0; i < tree.children.length; i++) {
                stack.push(tree.children[i]);
            }
        }
    }
}
var config_json_1 = require("./config.json");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return __importDefault(config_json_1).default; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtCQUFzRTtBQUl0RSxrRkFBOEU7QUFFOUUsK0RBQXlEO0FBRXpELE1BQU0sYUFBYSxHQUFHLElBQUksMEJBQW1CLEVBQUUsQ0FBQTtBQUNsQyxRQUFBLGdCQUFnQixHQUFHLElBQUksbUNBQWdCLEVBQW1CLENBQUE7QUFFdkUsSUFBSSxvQkFBZ0QsQ0FBQTtBQUNwRCxJQUFJLGlCQUEyQyxDQUFBO0FBQy9DLElBQUksU0FBMkIsQ0FBQTtBQUUvQixTQUFnQixRQUFRO0lBQ3BCLGlCQUFpQixHQUFHLElBQUksdUNBQWlCLEVBQUUsQ0FBQTtJQUczQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLHNDQUFzQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7UUFDekYsaUJBQWlCLGFBQWpCLGlCQUFpQix1QkFBakIsaUJBQWlCLENBQUUsT0FBTyxFQUFFLENBQUE7UUFFNUIsSUFBSSxTQUFTLEVBQUU7WUFDWCxpQkFBaUIsYUFBakIsaUJBQWlCLHVCQUFqQixpQkFBaUIsQ0FBRSxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUN2RDtJQUNMLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFHSCxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsR0FBRyxFQUFFO1FBQ3hELDJCQUEyQixFQUFFLENBQUE7UUFDN0IsdUJBQXVCLEVBQUUsQ0FBQTtRQUV6QixNQUFNLEVBQUUsQ0FBQTtJQUNaLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDUCxDQUFDO0FBbkJELDRCQW1CQztBQUVELFNBQWdCLFVBQVU7SUFDdEIsMkJBQTJCLEVBQUUsQ0FBQTtJQUM3QixhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7SUFF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R3hELE1BQU0sS0FBSyxHQUFrQixPQUFPLENBQUMsWUFBWSxDQUFBO0lBQ2pELE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDckIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3hCLElBQUksSUFBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksV0FBVyxJQUFJLFdBQVcsSUFBSSxDQUFDLE1BQUEsTUFBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsV0FBVywwQ0FBRSxHQUFHLG1DQUFJLFdBQVcsQ0FBQyxFQUFFO1lBQ2xHLElBQUksVUFBVSxJQUFJLElBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLFdBQVcsRUFBRTtnQkFDdEQsaUJBQWlCLGFBQWpCLGlCQUFpQix1QkFBakIsaUJBQWlCLENBQUUsT0FBTyxDQUFDLE1BQUEsQ0FBQyxJQUFLLENBQUMsa0JBQWtCLElBQUksSUFBSyxDQUFDLFNBQVMsQ0FBQyxtQ0FBSSxFQUFFLENBQUMsQ0FBQTthQUNsRjtZQUVELElBQUksSUFBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUc1QixNQUFLO2FBQ1I7WUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzVDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ2hDO1NBQ0o7S0FDSjtBQUNMLENBQUM7QUFFRCw2Q0FBaUQ7QUFBeEMsc0hBQUEsT0FBTyxPQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgQ3Vyc29yUG9zaXRpb25DaGFuZ2VkRXZlbnQgfSBmcm9tIFwiYXRvbVwiXG5pbXBvcnQgeyBTdGF0dXNCYXIgfSBmcm9tIFwiYXRvbS9zdGF0dXMtYmFyXCJcblxuaW1wb3J0IHsgT3V0bGluZVByb3ZpZGVyLCBPdXRsaW5lVHJlZSB9IGZyb20gXCJhdG9tLWlkZS1iYXNlXCJcbmltcG9ydCB7IFByb3ZpZGVyUmVnaXN0cnkgfSBmcm9tIFwiYXRvbS1pZGUtYmFzZS9jb21tb25zLWF0b20vUHJvdmlkZXJSZWdpc3RyeVwiXG5cbmltcG9ydCB7IE91dGxpbmVTdGF0dXNWaWV3IH0gZnJvbSBcIi4vb3V0bGluZS1zdGF0dXMtdmlld1wiXG5cbmNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5leHBvcnQgY29uc3QgcHJvdmlkZXJSZWdpc3RyeSA9IG5ldyBQcm92aWRlclJlZ2lzdHJ5PE91dGxpbmVQcm92aWRlcj4oKVxuXG5sZXQgZWRpdG9yX3N1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGUgfCBudWxsXG5sZXQgb3V0bGluZVN0YXR1c1ZpZXc6IE91dGxpbmVTdGF0dXNWaWV3IHwgbnVsbFxubGV0IHN0YXR1c0JhcjogU3RhdHVzQmFyIHwgbnVsbFxuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgb3V0bGluZVN0YXR1c1ZpZXcgPSBuZXcgT3V0bGluZVN0YXR1c1ZpZXcoKVxuXG4gICAgLy8gUmVnaXN0ZXIgY29uZmlnIG1vbml0b3JzXG4gICAgc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoXCJhdG9tLWlkZS1zdGF0dXNiYXIuc3RhdHVzYmFyUHJpb3JpdHlcIiwgKHZhbHVlcykgPT4ge1xuICAgICAgICBvdXRsaW5lU3RhdHVzVmlldz8udW5tb3VudCgpXG5cbiAgICAgICAgaWYgKHN0YXR1c0Jhcikge1xuICAgICAgICAgICAgb3V0bGluZVN0YXR1c1ZpZXc/Lm1vdW50KHN0YXR1c0JhciwgdmFsdWVzLm5ld1ZhbHVlKVxuICAgICAgICB9XG4gICAgfSkpXG5cbiAgICAvLyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBzdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0oKCkgPT4ge1xuICAgICAgICB1bnN1YnNjcmliZUxhc3RBY3RpdmVFZGl0b3IoKVxuICAgICAgICBzdWJzY3JpYmVUb0FjdGl2ZUVkaXRvcigpXG5cbiAgICAgICAgdG9nZ2xlKClcbiAgICB9KSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUoKSB7XG4gICAgdW5zdWJzY3JpYmVMYXN0QWN0aXZlRWRpdG9yKClcbiAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gICAgb3V0bGluZVN0YXR1c1ZpZXc/LmRlc3Ryb3koKVxuICAgIG91dGxpbmVTdGF0dXNWaWV3ID0gbnVsbFxuXG4gICAgc3RhdHVzQmFyID0gbnVsbFxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3VtZVN0YXR1c0JhcihzYjogU3RhdHVzQmFyKSB7XG4gICAgc3RhdHVzQmFyID0gc2JcblxuICAgIGNvbnN0IHByaW9yaXR5ID0gYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1pZGUtc3RhdHVzYmFyLnN0YXR1c2JhclByaW9yaXR5XCIpXG4gICAgb3V0bGluZVN0YXR1c1ZpZXc/Lm1vdW50KHN0YXR1c0JhciwgcHJpb3JpdHkpXG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnN1bWVPdXRsaW5lUHJvdmlkZXIocHJvdmlkZXI6IE91dGxpbmVQcm92aWRlcikge1xuICAgIHN1YnNjcmlwdGlvbnMuYWRkKHByb3ZpZGVyUmVnaXN0cnkuYWRkUHJvdmlkZXIocHJvdmlkZXIpKVxufVxuXG5mdW5jdGlvbiBzdWJzY3JpYmVUb0FjdGl2ZUVkaXRvcigpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoZWRpdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgZWRpdG9yX3N1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBlZGl0b3Jfc3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oKGV2dDogQ3Vyc29yUG9zaXRpb25DaGFuZ2VkRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGV2dC5vbGRCdWZmZXJQb3NpdGlvbi5yb3cgPT0gZXZ0Lm5ld0J1ZmZlclBvc2l0aW9uLnJvdykge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGUoKVxuICAgIH0pKVxuXG4gICAgZWRpdG9yX3N1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5vbkRpZFNhdmUoKCkgPT4ge1xuICAgICAgICB0b2dnbGUoKVxuICAgIH0pKVxufVxuXG5mdW5jdGlvbiB1bnN1YnNjcmliZUxhc3RBY3RpdmVFZGl0b3IoKSB7XG4gICAgZWRpdG9yX3N1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIGVkaXRvcl9zdWJzY3JpcHRpb25zID0gbnVsbFxufVxuXG5hc3luYyBmdW5jdGlvbiB0b2dnbGUoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKGVkaXRvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG91dGxpbmVTdGF0dXNWaWV3Py5jbGVhcigpXG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChlZGl0b3IuZ2V0UGF0aCgpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb3V0bGluZVN0YXR1c1ZpZXc/LmNsZWFyKClcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgb3V0bGluZVN0YXR1c1ZpZXc/LmNsZWFyKClcblxuICAgIGNvbnN0IHByb3ZpZGVyID0gcHJvdmlkZXJSZWdpc3RyeS5nZXRQcm92aWRlckZvckVkaXRvcihlZGl0b3IpXG4gICAgY29uc3Qgb3V0bGluZSA9IGF3YWl0IHByb3ZpZGVyPy5nZXRPdXRsaW5lKGVkaXRvcilcbiAgICBpZiAob3V0bGluZT8ub3V0bGluZVRyZWVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgc2hvd19vdXRlciA9IGF0b20uY29uZmlnLmdldChcImF0b20taWRlLXN0YXR1c2Jhci5vdXRlclNjb3BlXCIpXG4gICAgY29uc3QgY3VycmVudF9yb3cgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3dcblxuICAgIC8vIFN0YXJ0IGEgZGVwdGggZmlyc3Qgc2VhcmNoIGxvb2tpbmcgZm9yIHRoZSB0cmVlIGNvdmVyaW5nIGN1cnJlbnQgcm93OlxuICAgIGNvbnN0IHN0YWNrOiBPdXRsaW5lVHJlZVtdID0gb3V0bGluZS5vdXRsaW5lVHJlZXNcbiAgICB3aGlsZSAoc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCB0cmVlID0gc3RhY2sucG9wKClcbiAgICAgICAgaWYgKHRyZWUhLnN0YXJ0UG9zaXRpb24ucm93IDw9IGN1cnJlbnRfcm93ICYmIGN1cnJlbnRfcm93IDw9ICh0cmVlPy5lbmRQb3NpdGlvbj8ucm93ID8/IGN1cnJlbnRfcm93KSkge1xuICAgICAgICAgICAgaWYgKHNob3dfb3V0ZXIgfHwgdHJlZSEuc3RhcnRQb3NpdGlvbi5yb3cgPT0gY3VycmVudF9yb3cpIHtcbiAgICAgICAgICAgICAgICBvdXRsaW5lU3RhdHVzVmlldz8uYWRkVGV4dCgodHJlZSEucmVwcmVzZW50YXRpdmVOYW1lIHx8IHRyZWUhLnBsYWluVGV4dCkgPz8gXCJcIilcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRyZWUhLmNoaWxkcmVuLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UncmUgbm93IGF0IHRoZSBsZWFmIG5vZGUgb2YgdGhlIHRyZWUgY292ZXJpbmcgdGhlIGN1cnJlbnQgbGluZSxcbiAgICAgICAgICAgICAgICAvLyB0aGVyZSBpcyBubyB2YWx1ZSB0byBjb250aW51ZSB0aGUgREZTIG9uIG90aGVyIHNpbGJsaW5nIHRyZWVzLlxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJlZSEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRyZWUhLmNoaWxkcmVuW2ldKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBkZWZhdWx0IGFzIGNvbmZpZyB9IGZyb20gXCIuL2NvbmZpZy5qc29uXCJcbiJdfQ==