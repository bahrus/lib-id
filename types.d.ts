export interface LiBidProps{
    from: string;
    fromChildTemplate: boolean;
    fct: boolean;
    fromPreviousSibling: boolean;
    fps: boolean;
    //templateId: string | undefined;
    templateMapIds: {[key: string] : string} | undefined;
    templateMapElements: {[key: string]: HTMLTemplateElement} | undefined;
    /**
     * Element to clone
     */
    etc: Element | undefined;
    tagAttr: {[key:string]: string} | undefined;
}