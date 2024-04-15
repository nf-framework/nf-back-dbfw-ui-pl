import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class DbfwCommonSelect extends PlForm {
    static properties = {
        mdl: {},
        unit: {},
        unitName: {},
        dtList: { value: () => [] },
        selected: { value: () => ({}) },
        formTitle: {},
        exclude: {},
        multiSelect: { type: Boolean, value: false},
        selectedList: { type: Array, value: []},
        hideBtnSelectAll: {type: Boolean, value: false},
        loading: { type: Boolean },
    }
    static templateBegin = `
        <pl-flex-layout vertical fit>
            <pl-flex-layout fit>
                <pl-grid multi-select="[[multiSelect]]" data="{{dtList}}" selected="{{selected}}" selected-list="{{selectedList}}" on-row-dblclick="[[select]]">
                <pl-flex-layout fit vertical  slot="top-toolbar">
                    <pl-button label="Выбрать все" hidden="[[hideBtnSelectAll]]" variant="secondary" on-click="[[selectAll]]">
                    <pl-icon iconset="pl-default" size="16" icon="check-s" slot="prefix"></pl-icon>
                </pl-button>
                </pl-flex-layout>
        `

    static templateEnd = `
                </pl-grid>
            </pl-flex-layout>
            <pl-flex-layout stretch>
                <pl-button label="Выбрать" variant="primary" on-click="[[select]]" disabled="[[!selected]]">
                    <pl-icon iconset="pl-default" size="16" icon="check-circle" slot="prefix"></pl-icon>
                </pl-button>
                <pl-button label="Отменить" variant="secondary" on-click="[[close]]">
                    <pl-icon iconset="pl-default" size="16" icon="close-circle" slot="prefix"></pl-icon>
                </pl-button>
            </pl-flex-layout>
        </pl-flex-layout>
        <pl-dataset partial-data id="dsList" data="{{dtList}}" args="[[_compose('exclude',exclude)]]" executing="{{loading}}"></pl-dataset>
    `;

    onConnect() {
        this.set('formTitle', `Выбор из справочника: ${this.unitName}`);
        this.$.dsList.execute()
    }

    select() {
        if(this.multiSelect) {
            this.close(this.selectedList);
        } else {
            this.close(this.selected);
        }
    }

    selectAll() {
        this.splice('selectedList', 0, this.selectedList.length, ...this.dtList);
    }
}
