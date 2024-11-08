import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class ExampleDictionary extends PlForm {
    static properties = {
        example1Control: {
            value: () => ({ sorts: [ { field: "caption", sort: "desc" } ]})
        },
        example1Value: {},
        example2Control: {
            value: () => ({ sorts: [ { field: "caption", sort: "asc" } ]})
        },
        example2Fields: {
            value: () => ([ { field: "code", name: "Код роли" } ])
        },
        example2Value: {},
        example3Control: {
            value: () => ({ sorts: [ { field: "id", sort: "asc" } ]})
        },
        example3Fields: {
            value: () => ([ { field: "code", name: "Код" }, { field: "caption", name: "Наименование роли" } ])
        },
        example3Value: {},
        example3ValueList: { value: ()=> []},
    }
    static template = html`
        <pl-flex-layout fit vertical>
            <pl-flex-layout>
                <pl-dictionary-combobox
                    label="1. pl-dictionary-combobox (Роль)"
                    value={{example1Value}}
                    code="nfc.roles"
                    fields="caption"
                    value-property="id"
                    text-property="code"
                    control="[[example1Control]]"
                >
                </pl-dictionary-combobox>
                <pl-input label="value" value="{{example1Value}}">
            </pl-flex-layout>
            <pl-flex-layout>
                <pl-dictionary-comboinput
                    label="pl-dictionary-comboinput (Роль)"
                    value={{example2Value}}
                    code="nfc.roles"
                    fields="[[example2Fields]]"
                    value-property="id"
                    text-property="code"
                    control="[[example2Control]]"
                >
                </pl-dictionary-comboinput>
                <pl-input label="value" value="{{example2Value}}">
            </pl-flex-layout>
            <pl-flex-layout>
                <pl-dictionary-comboinput
                    label="pl-dictionary-comboinput multi-select (Роль)"
                    value={{example3Value}}
                    valueList={{example3ValueList}}
                    code="nfc.roles"
                    fields="[[example3Fields]]"
                    value-property="id"
                    text-property="code"
                    control="[[example3Control]]"
                    multi-select
                >
                </pl-dictionary-comboinput>
                <pl-input label="value" value="{{example3Value}}">
            </pl-flex-layout>
        </pl-flex-layout>
    `;
}