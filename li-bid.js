import { IBid, objProp1, objProp2, onNewList, linkInitialized } from 'ib-id/i-bid.js';
import { xc } from 'xtal-element/lib/XtalCore.js';
import { TemplateInstance } from 'templ-arts/lib/index.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
//#region props
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
export class LiBid extends IBid {
    static is = 'li-bid';
    static observedAttributes = [...IBid.observedAttributes, ...slicedPropDefs.boolNames, ...slicedPropDefs.numNames, ...slicedPropDefs.strNames];
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        xc.passAttrToProp(this, slicedPropDefs, n, ov, nv);
    }
    propActions = propActions;
    _retries = 0;
    templateInstances = new WeakMap();
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
        super.connectedCallback();
        xc.mergeProps(this, slicedPropDefs);
    }
    configureNewChild(newChild) {
        if (this.tagAttr !== undefined) {
            for (const key in this.tagAttr) {
                newChild.setAttribute(key, this.tagAttr[key]);
            }
        }
    }
}
const linkMainTemplate = ({ templateId, self }) => {
    let mainTemplate;
    if (templateId === 'innerTemplate') {
        mainTemplate = self.querySelector('template');
    }
    else {
        mainTemplate = upShadowSearch(self, templateId);
    }
    if (mainTemplate === null) {
        if (self._retries < 1) {
            self._retries++;
            setTimeout(() => {
                linkMainTemplate(self);
            }, 50);
            return;
        }
        else {
            console.error("Unable to locate template: " + templateId, self);
            return;
        }
    }
    self.mainTemplate = mainTemplate;
    const parentElement = mainTemplate.parentElement;
    if (parentElement !== null && parentElement !== self && self.contains(mainTemplate)) {
        self.appendChild(mainTemplate);
    }
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
    //linkInitialized,
    templatesManaged,
    onNewList,
];
xc.letThereBeProps(LiBid, slicedPropDefs, 'onPropChange');
xc.define(LiBid);
