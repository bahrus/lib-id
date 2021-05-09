import {IBid, objProp1, objProp2, onNewList, markOwnership} from 'ib-id/i-bid.js';
import {xc, PropAction, PropDef, PropDefMap} from 'xtal-element/lib/XtalCore.js';
import {TemplateInstance} from '@github/template-parts/lib/index.js';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';

export class LiBid extends IBid{
    static is = 'li-bid';
    propActions = propActions;
    templateMapIds: {[key: string] : string} | undefined;
    templateMapElements: {[key: string]: HTMLTemplateElement} | undefined;
    templateInstances = new WeakMap<Element, TemplateInstance>();
    updateLightChildren(element: Element, item: any, idx: number){
        if(!this.templateInstances.has(element)){
            const template = this.templateMapElements![element.localName];
            if(template === undefined) return;
            const tpl = new TemplateInstance(template, item);
            this.templateInstances.set(element, tpl);
            element.appendChild(tpl);
        }else{
            const tpl = this.templateInstances.get(element);
            tpl!.update(item);
        }
    }
    connectedCallback(){
        xc.mergeProps(this, slicedPropDefs);
        super.connectedCallback();
    }
}

const templatesManaged = ({templateMapIds, self}: REpetir) => {
    
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
};

const linkInitialized = ({ownedSiblingCount, templateMapElements: templateRefs, self}: REpetir) => {
    if(ownedSiblingCount !== 0){
        markOwnership(self, ownedSiblingCount!);
    }else{
        self.initialized = true;
    }
}

const propActions = [
    templatesManaged,
    linkInitialized,
    onNewList,
] as PropAction[];

const propDefMap: PropDefMap<LiBid> = {
    templateMapIds: objProp2,
    templateMapElements: objProp1
}
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(LiBid, slicedPropDefs, 'onPropChange');
xc.define(LiBid);