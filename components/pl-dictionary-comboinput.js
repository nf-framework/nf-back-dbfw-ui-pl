import { css, html, PlElement } from 'polylib';
import '@nfjs/front-pl/components/pl-comboinput.js';

await customElements.whenDefined('pl-comboinput');

class PlDictionaryComboinput extends PlElement {
    static properties = {
        label: { type: String },
        contentWidth: { type: Number },
        labelWidth: { type: Number },
        variant: { type: String, value: 'text', reflectToAttribute: true },
        background: { type: String },
        size: { type: String, value: 'medium' },
        stretch: { type: Boolean, reflectToAttribute: true },
        orientation: { type: String },
        multiSelect: { type: Boolean,  value: false },
        value: { type: String },
        valueList: { type: Array },
        text: { type: String },
        selected: { type: Object  },
        selectedList: { type: Array },
        placeholder: { type: String },
        disabled: { type: Boolean, reflectToAttribute: true },
        hidden: { type: Boolean, reflectToAttribute: true },
        required: { type: Boolean },
        readonly: { type: Boolean },
        invalid: { type: Boolean },

        // Поле значения, записываемое в value/valueList
        valueProperty: { type: String },
        // Поле отображения, записываемое в text
        textProperty: { type: String },
        // Поле, на которое ссылаются дочерние записи
        keyProperty: { type: String },
        // Поле иерархии
        pkeyProperty: { type: String },
        actualDate: { type: Date, value: new Date() },

        // Код справочника
        code: { type: String },
        // Эндпоинт для получения записей справочника
        getRecordEndpoint: { type: String, value: '/@nfjs/dictionary/values' },
        // Форма для выбора (по умолчанию используется значение defaultForm)
        form: { type: String },
        isModal: {type: Boolean, value: true },
        defaultForm: { type: String, value: 'dictionary.select' },
        formOptions: { type: Object, value: () => ({ size: 'medium' }) },
        // поля для отображения
        fields: { type: Array, value: () => [] },
        // Контрол для передачи доп. настроек в control
        control: { type: Object, value: () => ({}) },

        textLoad: { type: Boolean, value: false, },        
    }

    static css = css`
        :host([stretch]) {
            width: 100%;
            flex-shrink: 1;
        }
    `;

    static template = html`
        <pl-comboinput
            label="[[label]]"
            conten-width="[[contentWidth]]"
            label-width="[[labelWidth]]"
            variant="[[variant]]"
            background="[[background]]"
            size="[[size]]"
            stretch="[[stretch]]"
            orientation="[[orientation]]"
            value="{{value}}"
            value-list="{{valueList}}"
            text="{{text}}"
            selected="{{selected}}"
            selected-list="{{selectedList}}"
            placeholder="[[placeholder]]"
            disabled="[[disabled]]"
            hidden="[[hidden]]"
            required="[[required]]"
            readonly="[[readonly]]"
            invalid="{{invalid}}"
            value-property="[[valueProperty]]"
            text-property="[[textProperty]]"
            on-menu-click="[[onMenuClick]]"
            multi-select="[[multiSelect]]"
        ></pl-comboinput>
    `;

    connectedCallback() {
        super.connectedCallback();

        if (!this._formsThread) {
            let node = this;
            while (node) {
                if (node._formsThread) {
                    this._formsThread = node._formsThread;
                    break;
                } else {
                    node = node.parentNode ?? node.host;
                }
            }
        }
    }

    open(name, params, opts) {
        return this._formsThread?.open(name, { ...opts, params });
    }

    notify(message, options) {
        options = {
            type: 'success',
            header: 'Успех',
            icon: '',
            buttons: [],
            ...options
        };

        document.dispatchEvent(new CustomEvent('toast', {
            bubbles: true,
            composed: true,
            detail: {
                message: message,
                options: options
            }
        }));
    }

    async onMenuClick(event) {
        if (!this.code) return console.error('Не указан код справочника.');
        const args = {
            code: this.code,
            actualDate: this.actualDate,
            endpoint: this.endpoint,
            control: this.control,
            valueProperty: this.valueProperty,
            textProperty: this.textProperty,
            keyProperty: this.keyProperty,
            pkeyProperty: this.pkeyProperty,
            multiSelect: this.multiSelect,
            fields: this.fields
        }
        const formOptions = {...this.formOptions };
        formOptions.modal = this.isModal;
        const form = this.form || this.defaultForm;
        const result = await this.open(form, args, formOptions);

        if (result) {
            if (this.multiSelect) {
                if (Array.isArray(result)) {
                    this.selectedList = result;
                    const values = result.map(res => res[this.valueProperty]);
                    this.valueList = values;
                    this.value = values.join('; ');
                }
            } else {
                this.selected = result;
                this.value = result[this.valueProperty]
            }
        }
    }
}

customElements.define('pl-dictionary-comboinput', PlDictionaryComboinput);
