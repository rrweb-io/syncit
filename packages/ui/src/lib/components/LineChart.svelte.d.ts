/** @typedef {typeof __propDef.props}  LineChartProps */
/** @typedef {typeof __propDef.events}  LineChartEvents */
/** @typedef {typeof __propDef.slots}  LineChartSlots */
export default class LineChart extends SvelteComponentTyped<{
    width?: number | undefined;
    height?: number | undefined;
    color?: string | undefined;
    points?: any[] | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type LineChartProps = typeof __propDef.props;
export type LineChartEvents = typeof __propDef.events;
export type LineChartSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        width?: number | undefined;
        height?: number | undefined;
        color?: string | undefined;
        points?: any[] | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
