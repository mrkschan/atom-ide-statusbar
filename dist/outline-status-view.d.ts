import { StatusBar } from "atom/status-bar";
export declare class OutlineStatusView {
    private element;
    private statusBarTile;
    constructor();
    destroy(): void;
    mount(statusBar: StatusBar, priority: number): void;
    unmount(): void;
    getElement(): HTMLDivElement;
    clear(): void;
    addText(text: string): void;
}
