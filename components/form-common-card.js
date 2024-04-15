import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class DbfwCommonCard extends PlForm {
    static properties = {
        mdl: {},
        unit: {},
        unitName: {},
        formTitle: {},
        urlParams: {
            type: Array,
            value: ['recordId']
        },
        recordId: {},
        record: { value: () => ({}) },
        invalid: { value: false },
        changed: {},
        pr: {}
    }
    static templateBegin = `
    <pl-flex-layout vertical fit>
        <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
        <pl-flex-layout vertical fit scrollable>
    `
    static templateEnd = `
        </pl-flex-layout>
        <pl-flex-layout>
            <pl-button label="Сохранить" variant="primary" on-click="[[onSaveClick]]" disabled="[[saveDisabled(invalid,changed)]]" hidden="[[saveHidden(pr)]]">
                <pl-icon iconset="pl-default" size="16" icon="save" slot="prefix"></pl-icon>
            </pl-button>
            <pl-button label="Отменить" variant="secondary" on-click="[[close]]">
                <pl-icon iconset="pl-default" size="16" icon="close-circle" slot="prefix"></pl-icon>
            </pl-button>
        </pl-flex-layout>
    </pl-flex-layout>
    <pl-data-observer id="obRecord" data="{{record}}" is-changed="{{changed}}"></pl-data-observer>
    <pl-access id="acPrivs" data="{{pr}}"></pl-access>
    <pl-action id="aGet" data="{{record}}"></pl-action>
    <pl-action id="aSave"></pl-action>
    `

    async onConnect() {
        this.formTitle = `${this.unitName}: ${(this.recordId ? 'Редактирование' : 'Добавление')}`;
        if (this.recordId) {
            await this.$.aGet.execute({id: this.recordId})
        }
        this.$.obRecord.reset();
        this.$.obRecord.snapshot();
    }

    async onSaveClick() {
        let res = await this.$.aSave.execute(this.record);
        this.$.obRecord.reset();
        this.$.obRecord.snapshot();
        this.close(res)
    }

    async onClose() {
        if (this.changed) {
            return await this.showConfirm('Имеются несохранённые данные. Уверены что хотите закрыть?')
        }
    }

    saveDisabled(invalid, changed) {
        return invalid || !changed;
    }

    saveHidden(v) {
        if (!v) return true;
        return ((this.recordId && !v.privs[this.mdl][this.unit].upd) || (!this.recordId && !v.privs[this.mdl][this.unit].add));
    }
}