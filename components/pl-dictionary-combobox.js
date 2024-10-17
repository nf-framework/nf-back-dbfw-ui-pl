import '@plcmp/pl-combobox';
import { css, html, PlElement } from 'polylib';
import { compose } from '@nfjs/core/api/common.js';

await customElements.whenDefined('pl-combobox');

class PlDictionaryCombobox extends PlElement {
    static properties = {
        label: { type: String },
        contentWidth: { type: Number },
        labelWidth: { type: Number },
        fitInto: { type: Object, value: null },
        direction: { type: String, value: 'down' },
        variant: { type: String, value: 'text', reflectToAttribute: true },
        background: { type: String, reflectToAttribute: true },
        size: { type: String, reflectToAttribute: true },
        stretch: { type: Boolean, reflectToAttribute: true },
        orientation: { type: String },
        value: { type: String },
        valueList: { type: Array, value: () => [] },
        text: { type: String },
        selected: { type: Object },
        selectedList: { type: Array, value: () => [] },
        placeholder: { type: String },
        disabled: { type: Boolean, reflectToAttribute: true },
        hidden: { type: Boolean, reflectToAttribute: true },
        required: { type: Boolean },
        readonly: { type: Boolean },
        invalid: { type: Boolean },
        multiSelect: { type: Boolean, value: false },
        selectOnlyLeaf: { type: Boolean, value: false },
        tree: { type: Boolean },
        data: { value: () => [] },
        // предназначены для переназначения заданных в паспорте ключевых полей
        // Поле значения, записываемое в value/valueList
        valueProperty: { type: String },
        // Поле отображения, записываемое в text
        textProperty: { type: String },
        // Поле, на которое ссылаются дочерние записи
        keyProperty: { type: String },
        // Поле иерархии
        pkeyProperty: { type: String },
        // дата актуальности
        actualDate: { type: Date, value: new Date() },
        // Код справочника
        code: { type: String },
        // Эндпоинт для получения записей справчника
        endpoint: { type: String, value: '/@nfjs/dictionary/values' },
        // доп. поля для отображения
        fields: { type: String },
        // Контрол для передачи доп. настроек в control
        control: { type: Object, value: () => ({}) },

    }

    static css = css`
        :host([stretch]) {
            width: 100%;
            flex-shrink: 1;
        }
    `;

    static template = html`
        <pl-combobox
            label="[[label]]"
            data="[[data]]"
            value="{{value}}"
            text="{{text}}"
            value-list="{{valueList}}"
            selected="{{selected}}"
            selected-list="{{selectedList}}"
            conten-width="[[contentWidth]]"
            label-width="[[labelWidth]]"
            fit-into="[[fitInto]]"
            direction="[[direction]]"
            required="[[required]]"
            readonly="[[readonly]]"
            invalid="{{invalid}}"
            variant="[[variant]]"
            background="[[background]]"
            size="[[size]]"
            orientation="[[orientation]]"
            stretch="[[stretch]]"
            placeholder="[[placeholder]]"
            text-property="[[textProperty]]"
            value-property="[[valueProperty]]"
            key-property="[[keyProperty]]"
            pkey-property="[[pkeyProperty]]"
            tree="[[tree]]"
            select-only-leaf="[[selectOnlyLeaf]]"
            disabled="[[disabled]]"
            hidden="[[hidden]]"
            multi-select="[[multiSelect]]"
        >
        </pl-combobox>
        <pl-dataset id="dsData" data="{{data}}" 
            endpoint="[[endpoint]]"
            args="[[_compose('code;fields;control;actualDate',code,fields,control,actualDate)]]"
            execute-on-args-change
            required-args="code"
        ></pl-dataset>
    `;

    connectedCallback() {
        super.connectedCallback();
    }

    _compose(...arg) {
        return compose(...arg);
    }
}

customElements.define('pl-dictionary-combobox', PlDictionaryCombobox);
