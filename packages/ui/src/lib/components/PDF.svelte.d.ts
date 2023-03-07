/** @typedef {typeof __propDef.props}  PdfProps */
/** @typedef {typeof __propDef.events}  PdfEvents */
/** @typedef {typeof __propDef.slots}  PdfSlots */
export default class Pdf extends SvelteComponentTyped<{
    renderPDF?: (({ dataURI }: {
        dataURI: any;
    }) => void) | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {};
}> {
    get renderPDF(): ({ dataURI }: {
        dataURI: any;
    }) => void;
}
export type PdfProps = typeof __propDef.props;
export type PdfEvents = typeof __propDef.events;
export type PdfSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        renderPDF?: (({ dataURI }: {
            dataURI: any;
        }) => void) | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export {};
