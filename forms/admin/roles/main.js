import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class SubscriberEdit extends PlForm {
    static get properties() {
        return {
            role: {
                type: Object,
                value: () => ({
                    code: undefined,
                    caption: undefined
                })
            },
            invalid: {
                value: false
            },
            formTitle: {
                type: String,
                value: 'Добавление / редактирование роли'
            }
        }
    }

    static get template() {
        return html`
            <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
            <pl-flex-layout scrollable fit vertical>
                <pl-input variant="horizontal" label="Код" required value="{{role.code}}"></pl-input>
                <pl-input variant="horizontal" label="Наименование" required value="{{role.caption}}"></pl-input>
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
        `;
    }

    async onSaveClick() {
        this.$.aSave.execute(this.role)
            .then(() => {
                this.close();
            });
    }
}