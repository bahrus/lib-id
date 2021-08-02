import {IBid, objProp1, objProp2, onNewList, markOwnership, linkInitialized, boolProp1, boolProp2} from 'ib-id/i-bid.js';
import {xc, PropAction, PropDef, PropDefMap} from 'xtal-element/lib/XtalCore.js';
import {TemplateInstance} from 'templ-arts/lib/index.js';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';
import {LiBidProps} from './types.d.js';

//#region props
const baseProp: PropDef ={
    dry: true,
    async: true,
};
const strProp2: PropDef = {
    ...baseProp,
    stopReactionsIfFalsy: true,
    type: String,
};
const propDefMap: PropDefMap<LiBidProps> = {
    templateMapIds: objProp2,
    tagAttr: objProp2,
    etc: objProp1,
    templateMapElements: objProp1,
    from: strProp2,
    fromChildTemplate: boolProp2,
    fct: boolProp2,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
//#endregion

/**
 * @element li-bid
 * @tag li-bid
 */
export class LiBid extends IBid{
    static is = 'li-bid';
    static observedAttributes = [...IBid.observedAttributes, ...slicedPropDefs.boolNames, ...slicedPropDefs.numNames, ...slicedPropDefs.strNames, ...slicedPropDefs.parseNames];
    override attributeChangedCallback(n: string, ov: string, nv: string){
        super.attributeChangedCallback(n, ov, nv);
        xc.passAttrToProp(this, slicedPropDefs, n, ov, nv);
    }
    propActions = propActions;
    templateInstances = new WeakMap<Element, TemplateInstance>();
    updateLightChildren(element: Element, item: any, idx: number){
        if(!this.templateInstances.has(element)){
            let template: HTMLTemplateElement | undefined;
            if(this.templateMapElements !== undefined){
                template = this.templateMapElements![element.localName];
                if(template === undefined) return;
            }else{
                template = this.etc as HTMLTemplateElement; //TODO:  handle non template
            }
            const tpl = new TemplateInstance(template!, item);
            this.templateInstances.set(element, tpl);
            element.appendChild(tpl);
        }else{
            const tpl = this.templateInstances.get(element);
            tpl!.update(item);
        }
    }
    connectedCallback(){
        super.connectedCallback();
        xc.mergeProps(this, slicedPropDefs);
    }
    override configureNewChild(newChild: Element){
        if(this.tagAttr !== undefined){
            for(const key in this.tagAttr){
                newChild.setAttribute(key, this.tagAttr[key]);
            }
        }
    }
}
export interface LiBid extends LiBidProps{}
type L = LiBid;

const onFrom = ({from, self}: L) => {
    let mainTemplate: HTMLTemplateElement | null;
    mainTemplate = upShadowSearch(self, from!) as HTMLTemplateElement | null;
    if(mainTemplate === null) {
        console.error("Unable to locate template: " + from, self);
        return;
    }
    self.etc = mainTemplate;
};

const onFromChildTemplate = ({fromChildTemplate, self}: L) => {
    getInnerTemplate(self, 0);
};

const onFct = ({fct, self}: L) => {
    getInnerTemplate(self, 0);
}

function getInnerTemplate(self: L, retries: number){
    const templ = self.querySelector('template');
    if(templ === null){
        if(retries > 2) throw "Inner template not found";
        setTimeout(() => {
            getInnerTemplate(self, retries + 1);
        }, 50)
        return;
    }
    self.etc = templ;
}

const onEtcFound = ({etc, self}: L) => {
    linkInitialized(self);
}

const templatesManaged = ({templateMapIds, self}: LiBid) => {
    
    const templateInstances: {[key: string]: HTMLTemplateElement} = {};
    for(const key in templateMapIds){
        const templateId = templateMapIds[key];
        const referencedTemplate = upShadowSearch(self, templateId) as HTMLTemplateElement;
        if(referencedTemplate === null){
            throw `Template with id ${templateId} not found.`;
        }
        templateInstances[key] = referencedTemplate;
    }
    self.templateMapElements = templateInstances;
    linkInitialized(self);
};

// const linkInitialized = ({ownedSiblingCount, self}: LiBid) => {
//     if(ownedSiblingCount !== 0){
//         markOwnership(self, ownedSiblingCount!);
//     }else{
//         self.initialized = true;
//     }
// }

const propActions = [
    onFrom,
    onFromChildTemplate,
    onEtcFound,
    //linkInitialized,
    templatesManaged,
    onNewList,
] as PropAction[];


xc.letThereBeProps(LiBid, slicedPropDefs, 'onPropChange');
xc.define(LiBid);