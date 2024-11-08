import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class DictionarySelect extends PlForm {
    static properties = {
        formTitle: { type: String, value: 'Выбор элемента из справочника' },
        data: { type: Array, value: () => [] },
        multiSelect: {type: Boolean, value: false},
        value: { type: String },
        valueList: { type: Array },
        valueProperty: { type: String },
        textProperty: { type: String },
        keyProperty: { type: String },
        pkeyProperty: { type: String },

        selected: { type: Object },
        selectedList : { type: Array, value: () => [] },
        // Код справочника
        code: { type: String },
        // Эндпоинт для получения записей справочника
        valuesEndpoint: { type: String, value: '/@nfjs/dictionary/values' },
        // Контрол для передачи доп. настроек в control
        control: { type: Object, value: () => ({}) },
        actualDate: { type: Date, value: new Date() },
        // настройки видимых полей
        fields: { type: Array, value: ()=> []},
        gridFields: { type: Array, value: ()=> []},       
    };

    static template = html`
        <pl-flex-layout fit vertical>
            <pl-filter-container data="{{data}}" id="fltrContainer">
                <pl-grid id="grid" data="{{data}}" multi-select="[[multiSelect]]" selected="{{selected}}" selected-list="{{selectedList}}" on-row-dblclick="[[onRowDblclick]]">
                    <pl-grid-column d:repeat="[[gridFields]]" width="[[item.width]]" header="[[item.name]]" field="[[item.field]]" sort="[[item.sort]]" resizable>
                        <pl-filter-item slot="filter" field="[[item.field]]">
                            <pl-input type="string" placeholder="Поиск"/>
                        </pl-filter-item>
                    </pl-grid-column>
                </pl-grid>
            </pl-filter-container>
            <pl-flex-layout justify="flex-end" stretch>
                <pl-button variant="ghost" label="Отменить" on-click="[[close]]"></pl-button>
                <pl-button variant="primary" label="Выбрать" on-click="[[onSelectClick]]" disabled="[[selectedDisabled(selected, selectedList)]]"></pl-button>
            </pl-flex-layout>
        </pl-flex-layout>

        <pl-dataset partial-data id="dsData" data="{{data}}" endpoint="[[valuesEndpoint]]"></pl-dataset>
    `;

    async onConnect() {
        this.addEventListener('keydown', async (ev) => {
            if (ev.key === 'Enter') {
                await this.reload();
            }
        });       
        this.set('gridFields', this.fields.filter(item=>item.field && item.name));
        this.reload();
    }

    async reload() {
        this.$.fltrContainer.applyFilters();
        const fields = (this.fields || []).map(f => f.field);
        if (this.valueProperty && !fields.includes(this.valueProperty)) fields.push(this.valueProperty);
        if (this.textProperty && !fields.includes(this.textProperty)) fields.push(this.textProperty);
        if (this.keyProperty && !fields.includes(this.keyProperty)) fields.push(this.keyProperty);
        if (this.pkeyProperty && !fields.includes(this.pkeyProperty)) fields.push(this.pkeyProperty);
        const args = {
            code: this.code,
            fields: fields.join(';'),
            control: this.control,
            actualDate: this.actualDate
        };
        await this.$.dsData.execute(args);
    }
    
    onRowDblclick() {
        if (!this.multiSelect) this.close(this.selected);
    }

    onSelectClick() {
        this.close(
            this.multiSelect ? this.selectedList : this.selected
        );
    }

    selectedDisabled(selected, selectedList) {
        return this.multiSelect ? this.selectedList.length === 0 : !this.selected;
    }

}