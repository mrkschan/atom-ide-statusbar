import { StatusBar } from "atom/status-bar";
import { OutlineProvider } from "atom-ide-base";
import { ProviderRegistry } from "atom-ide-base/commons-atom/ProviderRegistry";
export declare const providerRegistry: ProviderRegistry<OutlineProvider>;
export declare function activate(): void;
export declare function deactivate(): void;
export declare function consumeStatusBar(sb: StatusBar): void;
export declare function consumeOutlineProvider(provider: OutlineProvider): void;
export { default as config } from "./config.json";
