import { StatusBar, Tile } from "atom/status-bar"

export class OutlineStatusView {
    private element: HTMLDivElement
    private statusBarTile: Tile | null

    constructor() {
        // Create root element
        this.element = document.createElement("div")
        this.element.classList.add("atom-ide-statusbar", "func-info", "inline-block")

        this.statusBarTile = null
    }

    destroy() {
        // Tear down any state and detach
        this.unmount()
        this.element.remove()
    }

    mount(statusBar: StatusBar, priority: number) {
        this.statusBarTile = statusBar.addLeftTile({ item: this.element, priority: priority })
    }

    unmount() {
        this.statusBarTile?.destroy()
        this.statusBarTile = null
    }

    getElement() { return this.element }

    clear() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild)
        }

        this.element.classList.add("blank")
    }

    addText(text: string) {
        this.element.classList.remove("blank")

        const span = document.createElement("span")
        span.textContent = text
        this.element.appendChild(span)
    }
}
