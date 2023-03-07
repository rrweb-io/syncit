/** @typedef {typeof __propDef.props}  CanvasProps */
/** @typedef {typeof __propDef.events}  CanvasEvents */
/** @typedef {typeof __propDef.slots}  CanvasSlots */
export default class Canvas extends SvelteComponentTyped<{
    mode: any;
    stroke: any;
    strokeWidth: any;
    role?: string | undefined;
    startLine?: (() => void) | undefined;
    endLine?: (() => void) | undefined;
    setPoints?: ((points: any) => void) | undefined;
    highlight?: ((left: any, top: any) => void) | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
    get startLine(): () => void;
    get endLine(): () => void;
    get setPoints(): (points: any) => void;
    get highlight(): (left: any, top: any) => void;
}
export type CanvasProps = typeof __propDef.props;
export type CanvasEvents = typeof __propDef.events;
export type CanvasSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        mode: any;
        stroke: any;
        strokeWidth: any;
        role?: string | undefined;
        startLine?: (() => void) | undefined;
        endLine?: (() => void) | undefined;
        setPoints?: ((points: any) => void) | undefined;
        highlight?: ((left: any, top: any) => void) | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
