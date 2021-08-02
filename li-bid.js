import { IBid, objProp1, objProp2, onNewList, linkInitialized, boolProp2 } from 'ib-id/i-bid.js';
import { xc } from 'xtal-element/lib/XtalCore.js';
import { TemplateInstance } from 'templ-arts/lib/index.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
//#region props
const baseProp = {
    dry: true,
    async: true,
};
const strProp2 = {
    ...baseProp,
    stopReactionsIfFalsy: true,
    type: String,
};
const propDefMap = {
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
export class LiBid extends IBid {
    static is = 'li-bid';
    static observedAttributes = [...IBid.observedAttributes, ...slicedPropDefs.boolNames, ...slicedPropDefs.numNames, ...slicedPropDefs.strNames, ...slicedPropDefs.parseNames];
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        xc.passAttrToProp(this, slicedPropDefs, n, ov, nv);
    }
    propActions = propActions;
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
                template = this.etc; //TODO:  handle non template
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
const onFrom = ({ from, self }) => {
    let mainTemplate;
    mainTemplate = upShadowSearch(self, from);
    if (mainTemplate === null) {
        console.error("Unable to locate template: " + from, self);
        return;
    }
    self.etc = mainTemplate;
};
const onFromChildTemplate = ({ fromChildTemplate, self }) => {
    getInnerTemplate(self, 0);
};
const onFct = ({ fct, self }) => {
    getInnerTemplate(self, 0);
};
function getInnerTemplate(self, retries) {
    const templ = self.querySelector('template');
    if (templ === null) {
        if (retries > 2)
            throw "Inner template not found";
        setTimeout(() => {
            getInnerTemplate(self, retries + 1);
        }, 50);
        return;
    }
    self.etc = templ;
}
const onEtcFound = ({ etc, self }) => {
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
    onFrom,
    onFromChildTemplate,
    onEtcFound,
    //linkInitialized,
    templatesManaged,
    onNewList,
];
xc.letThereBeProps(LiBid, slicedPropDefs, 'onPropChange');
xc.define(LiBid);
