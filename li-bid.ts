import {IBid, objProp1, objProp2, onNewList, markOwnership, linkInitialized} from 'ib-id/i-bid.js';
import {xc, PropAction, PropDef, PropDefMap} from 'xtal-element/lib/XtalCore.js';
import {TemplateInstance} from 'templ-arts/lib/index.js';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';
import {LiBidProps} from './types.d.js';

//#region props
const baseProp: PropDef ={
    dry: true,
    async: true,
};
const strProp1: PropDef = {
    ...baseProp,
    stopReactionsIfFalsy: true,
    type: String,
};
const propDefMap: PropDefMap<LiBidProps> = {
    templateMapIds: objProp2,
    tagAttr: objProp2,
    templateMapElements: objProp1,
    templateId: strProp1
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
//#endregion

/**
 * @element li-bid
 * @tag li-bid
 */
export class LiBid extends IBid{
    static is = 'li-bid';
    static observedAttributes = [...IBid.observedAttributes, ...slicedPropDefs.boolNames, ...slicedPropDefs.numNames, ...slicedPropDefs.strNames];
    override attributeChangedCallback(n: string, ov: string, nv: string){
        super.attributeChangedCallback(n, ov, nv);
        xc.passAttrToProp(this, slicedPropDefs, n, ov, nv);
    }
    propActions = propActions;
    _retries = 0;
    templateInstances = new WeakMap<Element, TemplateInstance>();
    updateLightChildren(element: Element, item: any, idx: number){
        if(!this.templateInstances.has(element)){
            let template: HTMLTemplateElement | undefined;
            if(this.templateMapElements !== undefined){
                template = this.templateMapElements![element.localName];
                if(template === undefined) return;
            }else{
                template = this.mainTemplate;
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

const linkMainTemplate = ({templateId, self}: LiBid) => {
    let mainTemplate: HTMLTemplateElement | null;
    if(templateId === 'innerTemplate'){
        mainTemplate = self.querySelector('template');
    }else{
        mainTemplate = upShadowSearch(self, templateId!) as HTMLTemplateElement | null;
    }
    if(mainTemplate === null){
        if(self._retries < 1){
            self._retries++;
            setTimeout(() =>{
                linkMainTemplate(self);
            }, 50);
            return;
        }else{
            console.error("Unable to locate template: " + templateId, self);
            return;
        }
    } 
    self.mainTemplate = mainTemplate;
    const parentElement = mainTemplate.parentElement;
    if(parentElement !== null && parentElement !== self && self.contains(mainTemplate)){
        self.appendChild(mainTemplate);
    }
    linkInitialized(self);
};



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
    linkMainTemplate,
    //linkInitialized,
    templatesManaged,
    onNewList,
] as PropAction[];


xc.letThereBeProps(LiBid, slicedPropDefs, 'onPropChange');
xc.define(LiBid);