import {PlForm} from "@nfjs/front-pl/components/pl-form.js";
import {css, html} from "polylib";

export default class OptionsList extends PlForm {
    static properties = {
        formTitle: { type: String, value: 'Системные опции' },
        options: { type: Array },
        values: { type: Array },
        dataTypes: { type: Array },
        modules: { type: Array },
        orgs: { type: Array },
        users: { type: Array },
        selectedOption: { type: Object },
        selectedValue: { type: Object },
        editOption: { type: Object },
        editValue: { type: Object },
        editOptionInvalid: { type: Boolean },
        editValueInvalid: { type: Boolean }
    }
    static css = css`
      #optionsDialogButtons {
        align-self: flex-end;
      }
    `;
    static template = html`<pl-flex-layout fit vertical>
        <pl-grid data="{{options}}" selected="{{selectedOption}}">
            <pl-flex-layout stretch slot="top-toolbar">
                <pl-button id="btnOptionAdd" label="Добавить" variant="primary" on-click="[[addOptionClick]]"></pl-button>
            </pl-flex-layout>
            <pl-grid-column field="code" header="Код"></pl-grid-column>
            <pl-grid-column field="caption" header="Наименование"></pl-grid-column>
            <pl-grid-column field="datatype_code" header="Тип"></pl-grid-column>
            <pl-grid-column field="note" header="Примечание"></pl-grid-column>
            <pl-grid-column field="mdl_caption" header="Модуль"></pl-grid-column>
            <pl-grid-column field="multi_val" header="Множество значений">
                <template>
                    <pl-checkbox checked="{{row.multi_val}}"></pl-checkbox>
                </template>
            </pl-grid-column>
            <pl-grid-column field="val" header="Значение по умолчанию"></pl-grid-column>
            <pl-grid-column width="92px">
                <template>
                    <pl-flex-layout>
                        <pl-icon-button iconset="pl-default" icon="pencil" variant="link" on-click="[[editOptionClick]]"></pl-icon-button>
                        <pl-icon-button iconset="pl-default" icon="trashcan" variant="link" on-click="[[delOptionClick]]"></pl-icon-button>
                    </pl-flex-layout>
                </template>
            </pl-grid-column>
        </pl-grid>
        <pl-grid data="{{values}}" selected="{{selectedValue}}">
            <pl-flex-layout stretch slot="top-toolbar">
                <pl-button id="btnValueAdd" label="Добавить" variant="primary" on-click="[[addValueClick]]" disabled="[[!selectedOption]]"></pl-button>
            </pl-flex-layout>
            <pl-grid-column field="val" header="Значение"></pl-grid-column>
            <pl-grid-column width="92px">
                <template>
                    <pl-flex-layout>
                        <pl-icon-button iconset="pl-default" icon="pencil" variant="link" on-click="[[editValueClick]]"></pl-icon-button>
                        <pl-icon-button iconset="pl-default" icon="trashcan" variant="link" on-click="[[delValueClick]]"></pl-icon-button>
                    </pl-flex-layout>
                </template>
            </pl-grid-column>
        </pl-grid>
    </pl-flex-layout>
    <pl-dropdown id="ddOption">
        <pl-flex-layout vertical>
            <pl-input label="Код" orientation="horizontal" value="{{editOption.code}}" required></pl-input>
            <pl-input label="Наименование" orientation="horizontal" value="{{editOption.caption}}" required></pl-input>
            <pl-combobox label="Тип данных" orientation="horizontal" value="{{editOption.datatype}}" data="[[dataTypes]]" value-property="id" text-property="caption" required></pl-combobox>
            <pl-textarea label="Примечание" orientation="horizontal" value="{{editOption.note}}" stretch></pl-textarea>
            <pl-combobox label="Модуль" orientation="horizontal" value="{{editOption.mdl}}" data="[[modules]]" value-property="code" text-property="caption" required></pl-combobox>
            <pl-checkbox label="Множество значений" orientation="horizontal" checked="{{editOption.multi_val}}"></pl-checkbox>
            <pl-input label="Значение по умолчанию" orientation="horizontal" value="{{editOption.val}}" ></pl-input>
            <pl-flex-layout id="optionsDialogButtons">
                <pl-button label="Сохранить" on-click="[[saveOption]]" variant="primary" disabled="[[editOptionInvalid]]"></pl-button>
                <pl-button label="Отмена" on-click="[[cancelOption]]"></pl-button>
            </pl-flex-layout>
            <pl-valid-observer invalid="{{editOptionInvalid}}"></pl-valid-observer>
        </pl-flex-layout>
    </pl-dropdown>
    <pl-dropdown id="ddValue">
        <pl-flex-layout vertical>
            <pl-combobox label="Организация" orientation="horizontal" value="{{editValue.org_id}}" data="[[orgs]]" value-property="id" text-property="code"></pl-combobox>
            <pl-combobox label="Пользователь" orientation="horizontal" value="{{editValue.user_id}}" data="[[users]]" value-property="id" text-property="username"></pl-combobox>
            <pl-datetime label="Дата начала действия" value="{{editValue.date_begin}}" orientation="horizontal"></pl-datetime>
            <pl-datetime label="Дата окончания действия" value="{{editValue.date_end}}" orientation="horizontal"></pl-datetime>
            <pl-input label="Значение" orientation="horizontal" value="{{editValue.val}}" required></pl-input>
            <pl-flex-layout id="optionsDialogButtons">
                <pl-button label="Сохранить" on-click="[[saveValue]]" variant="primary" disabled="[[editValueInvalid]]"></pl-button>
                <pl-button label="Отмена" on-click="[[cancelValue]]"></pl-button>
            </pl-flex-layout>
        </pl-flex-layout>
    </pl-dropdown>
    <pl-dataset id="dsDataTypes" endpoint="/@nfjs/front-pl/fse/admin.options.list/dataset/dsDataTypes" data="{{dataTypes}}"></pl-dataset>
    <pl-dataset id="dsModules" endpoint="/@nfjs/front-pl/fse/admin.options.list/dataset/dsModules" data="{{modules}}"></pl-dataset>
    <pl-dataset id="dsOptions" endpoint="/@nfjs/front-pl/fse/admin.options.list/dataset/dsOptions" data="{{options}}"></pl-dataset>
    <pl-dataset id="dsValues" endpoint="/@nfjs/front-pl/fse/admin.options.list/dataset/dsValues" data="{{values}}" args="[[_compose('option',selectedOption.code)]]" required-args="option" execute-on-args-change></pl-dataset>
    <pl-dataset id="dsOrgs" endpoint="/@nfjs/front-pl/fse/admin.options.list/dataset/dsOrgs" data="{{orgs}}"></pl-dataset>
    <pl-dataset id="dsUsers" endpoint="/@nfjs/front-pl/fse/admin.options.list/dataset/dsUsers" data="{{users}}"></pl-dataset>
    <pl-action id="aSaveOption" endpoint="/@nfjs/front-pl/fse/admin.options.list/action/aSaveOption" args="[[_compose('...',editOption)]]"></pl-action>
    <pl-action id="aSaveValue" endpoint="/@nfjs/front-pl/fse/admin.options.list/action/aSaveValue" args="[[_compose('...',editValue)]]"></pl-action>
    <pl-action id="aDelOption" endpoint="/@nfjs/front-pl/fse/admin.options.list/action/aDelOption"></pl-action>
    <pl-action id="aDelValue" endpoint="/@nfjs/front-pl/fse/admin.options.list/action/aDelValue"></pl-action>
    `

    onConnect() {
        this.$.dsDataTypes.execute();
        this.$.dsModules.execute();
        this.$.dsOptions.execute();
        this.$.dsOrgs.execute();
        this.$.dsUsers.execute();
    }
    addOptionClick() {
        this.editOption = { multi_val: false };
        this.$.ddOption.open(this.$.btnOptionAdd);
    }
    async saveOption() {
        let res = await this.$.aSaveOption.execute();
        await this.$.dsOptions.execute();
        this.selectedOption = this.options.find(i => i.code === res.code);
        this.$.ddOption.close();
    }
    cancelOption() {
        this.$.ddOption.close();
    }
    editOptionClick(ev) {
        this.editOption = ev.model.row;
        this.$.ddOption.open(ev.target);
    }
    async delOptionClick(ev) {
        let res = await this.showConfirm('Вы действительно хотите удалить запись?')
        if(res) {
            await this.$.aDelOption.execute({code: ev.model.row.code});
            await this.$.dsOptions.execute();
        }
    }
    addValueClick() {
        this.editValue = { option: this.selectedOption.code };
        this.$.ddValue.open(this.$.btnValueAdd);
    }
    async saveValue() {
        let res = await this.$.aSaveValue.execute();
        await this.$.dsValues.execute();
        this.selectedValue = this.values.find(i => i.id === res.id);
        this.$.ddValue.close();
    }
    cancelValue() {
        this.$.ddOption.close();
    }
    editValueClick(ev) {
        this.editValue = ev.model.row;
        this.$.ddValue.open(ev.target);
    }
    async delValueClick(ev) {
        let res = await this.showConfirm('Вы действительно хотите удалить запись?')
        if(res) {
            await this.$.aDelValue.execute({id: ev.model.row.id});
            await this.$.dsValues.execute();
        }
    }
    serverEndpoints = {
        dataset: {
            dsOptions: {
                text: `select * from nfc.v4options`
            },
            dsValues: {
                text: `select * from nfc.v4options_values where option = :option`
            },
            dsDataTypes: {
                text: `select * from nfc.v4datatypes`
            },
            dsModules: {
                text: `select * from nfc.v4modulelist`
            },
            dsOrgs: {
                text: `select * from nfc.v4org`
            },
            dsUsers: {
                text: `select * from nfc.v4users`
            }
        },
        action: {
            aSaveOption: {
                '@main': {
                    action: 'nfc.options.mod',
                    type: 'broker',
                    out: "code"
                }
            },
            aDelOption: {
                '@main': {
                    action: 'nfc.options.del',
                    type: 'broker'
                }
            },
            aSaveValue: {
                '@main': {
                    action: 'nfc.options_values.mod',
                    type: 'broker',
                    out: "id"
                }
            },
            aDelValue: {
                '@main': {
                    action: 'nfc.options_values.del',
                    type: 'broker'
                }
            }
        }
    }//serverEndpoints
}