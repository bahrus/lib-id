export interface LiBidProps{
    from: string;
    fromTemplateChild: boolean;
    ftc: boolean;
    fromPreviousSibling: boolean;
    fps: boolean;
    templateId: string | undefined;
    templateMapIds: {[key: string] : string} | undefined;
    templateMapElements: {[key: string]: HTMLTemplateElement} | undefined;
    mainTemplate: HTMLTemplateElement | undefined;
    tagAttr: {[key:string]: string} | undefined;
}