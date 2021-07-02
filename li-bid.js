import { IBid, objProp1, objProp2, onNewList, linkInitialized } from 'ib-id/i-bid.js';
import { xc } from 'xtal-element/lib/XtalCore.js';
import { TemplateInstance } from '@github/template-parts/lib/index.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
export class LiBid extends IBid {
    constructor() {
        super(...arguments);
        this.propActions = propActions;
        this._retries = 0;
        this.templateInstances = new WeakMap();
    }
    updateLightChildren(element, item, idx) {
        if (!this.templateInstances.has(element)) {
            let template;
            if (this.templateMapElements !== undefined) {
                template = this.templateMapElements[element.localName];
                if (template === undefined)
                    return;
            }
            else {
                template = this.mainTemplate;
            }
            const tpl = new TemplateInstance(template, item);
            this.templateInstances.set(element, tpl);
            element.appendChild(tpl);
        }
        else {
            const tpl = this.templateInstances.get(element);
            tpl.update(item);
        }
    }
    connectedCallback() {
        xc.mergeProps(this, slicedPropDefs);
        super.connectedCallback();
    }
}
LiBid.is = 'li-bid';
const linkMainTemplate = ({ templateId, self }) => {
    const mainTemplate = upShadowSearch(self, templateId);
    if (!mainTemplate) {
        if (self._retries < 1) {
            self._retries++;
            setTimeout(() => {
                linkMainTemplate(self);
            }, 50);
            return;
        }
        else {
            console.error("Unable to locate template: " + templateId, self);
        }
    }
    self.mainTemplate = mainTemplate;
    mainTemplate.remove();
    linkInitialized(self);
};
const templatesManaged = ({ templateMapIds, self }) => {
    const templateInstances = {};
    for (const key in templateMapIds) {
        const templateId = templateMapIds[key];
        const referencedTemplate = upShadowSearch(self, templateId);
        if (referencedTemplate === null) {
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
    linkInitialized,
    templatesManaged,
    onNewList,
];
const baseProp = {
    dry: true,
    async: true,
};
const strProp1 = {
    ...baseProp,
    stopReactionsIfFalsy: true,
    type: String,
};
const propDefMap = {
    templateMapIds: objProp2,
    templateMapElements: objProp1,
    //mainTemplate: objProp1,
    templateId: strProp1
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(LiBid, slicedPropDefs, 'onPropChange');
xc.define(LiBid);
