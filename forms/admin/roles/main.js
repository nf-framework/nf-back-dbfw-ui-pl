import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class RoleEdit extends PlForm {
    static properties =  {
        role: {
            type: Object,
            value: () => ({
                id: undefined,
                code: undefined,
                caption: undefined
            })
        },
        roleId: {
            type: String,
            value: undefined
        },
        urlParams: {
            type: Array,
            value: ['roleId']
        },
        invalid: {
            value: false
        },
        formTitle: {
            type: String,
            value: 'Добавление / редактирование роли'
        }
    }

    static template = html`
        <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
        <pl-flex-layout scrollable fit vertical>
            <pl-input orientation="horizontal" label="Код" required="[[!role.id]]" value="{{role.code}}" disabled="[[role.id]]"></pl-input>
            <pl-input orientation="horizontal" label="Наименование" required value="{{role.caption}}"></pl-input>
            <pl-flex-layout>
                <pl-button label="Сохранить" variant="primary" disabled="[[invalid]]" on-click="[[onSaveClick]]">
                    <pl-icon iconset="pl-default" size="16" icon="save" slot="suffix"></pl-icon>
                </pl-button>
                <pl-button label="Отменить" variant="secondary" on-click="[[close]]">
                    <pl-icon iconset="pl-default" size="16" icon="close-circle" slot="suffix"></pl-icon>
                </pl-button>
            </pl-flex-layout>
        </pl-flex-layout>
        <pl-action id="aSave" endpoint="@nfjs/back-dbfw-ui-pl/roles/addRole"></pl-action>
        <pl-action id="aGet" data="{{role}}" args="[[_compose('roleId', roleId)]]" required-args="roleId" execute-on-args-change endpoint="@nfjs/back-dbfw-ui-pl/roles/getRole"></pl-action>
    `;

    async onSaveClick() {
        this.$.aSave.execute(this.role)
            .then(() => {
                this.close();
            });
    }
}