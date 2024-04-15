import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";
/** Пример без вставок:
 * ${CommonDictList.templateBegin}
 *   <pl-grid-column...>
 * ${CommonDictList.templateEnd}
 * Если нужны, к примеру, фильтры, то:
 *   <pl-flex-layout fit vertical>
 *     <pl-flex-layout align="flex-end">
 *      <pl-filter-container...>
 *         ...
 *     </pl-flex-layout>
 *        ${CommonDictList.templateGridBegin}
 *            <pl-grid-column>...
 *        ${CommonDictList.templateGridEnd}
 *     </pl-flex-layout>
 *     ${CommonDictList.templateDsList}
 *     <pl-dataset...>
 */
export default class DbfwCommonList extends PlForm {
    static properties = {
        mdl: {},
        unit: {},
        unitName: {},
        cardForm: {},
        cardFormIsModal: {},
        data: { value: () => [] },
        selected: { value: () => undefined },
        formTitle: {},
        pr: {},
    }

    static templateGridBegin = `
             <pl-grid data="{{data}}" selected="{{selected}}" on-row-dblclick="[[onAddUpdClick]]">
                <pl-flex-layout slot="top-toolbar">
                    <pl-button variant="primary" label="Добавить" id="add_action" on-click="[[onAddUpdClick]]" hidden="[[hiddenAdd(pr)]]">
                        <pl-icon iconset="pl-default" size="16" icon="plus-circle" slot="prefix"></pl-icon>
                    </pl-button>
                    <pl-button variant="ghost" label="Редактировать" on-click="[[onAddUpdClick]]" hidden="[[hiddenUpd(pr, selected)]]">
                        <pl-icon iconset="pl-default" size="16" icon="pencil" slot="prefix"></pl-icon>
                    </pl-button>
                    <pl-button variant="ghost" label="Удалить" on-click="[[onDelClick]]" hidden="[[hiddenDel(pr, selected)]]">
                        <pl-icon iconset="pl-default" size="16" icon="trashcan" slot="prefix"></pl-icon>
                    </pl-button>
                </pl-flex-layout>
    `
    static templateGridEnd = `
            </pl-grid>`

    static templateBegin = `
        <pl-flex-layout fit vertical>
        ${this.templateGridBegin}   
    `
    static templateDsList = `
        <pl-access id="acPrivs" data="{{pr}}"></pl-access>
        <pl-dataset partial-data id="dsData" data="{{data}}"></pl-dataset>
        <pl-action id="aDel"></pl-action>
    `
    static templateEnd = `
        ${this.templateGridEnd}
        </pl-flex-layout>
        ${this.templateDsList}
    `;

    onConnect() {
        this.set('formTitle', this.unitName);
        this.$.dsData.execute();
    }

    async onAddUpdClick(event) {
        let res
        const recordId = (event?.target?.id == 'add_action') ? null : this.selected?.id
        const cardForm = this.cardForm || `${this.mdl}.${this.unit}.card`;
        const openMethod = this.cardFormIsModal ? 'openModal' : 'open'
        res = await this[openMethod](cardForm, { recordId });
        if (res) {
            await this.$.dsData.execute();
            this.set('selected', this.data.find(v => v.id == res.id))
        }
    }

    async onDelClick(event) {
        if (!event && event.model) return
        let res = await this.showConfirm('Вы действительно хотите удалить запись?')
        if (res) {
            await this.$.aDel.execute({id: this.selected.id});
            await this.$.dsData.execute();
        }
    }

    hiddenAdd(pr) {
        return !pr?.privs?.[this.mdl]?.[this.unit]?.add ?? true;
    }

    hiddenUpd(pr, selected) {
        return !selected || (!pr?.privs?.[this.mdl]?.[this.unit]?.upd);
    }

    hiddenDel(pr, selected) {
        return !selected || (!pr?.privs?.[this.mdl]?.[this.unit]?.del);
    }
}
