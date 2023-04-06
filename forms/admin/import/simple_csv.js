import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class AdminImportSimpleCsv extends PlForm {
    static properties = {
        formTitle: {
            type: String,
            value: 'Простой импорт данных'
        },
        csv: { value: () => ({}) }
    }

    static template = html`
        <pl-tabpanel>
            <pl-tab header="csv">
                <pl-flex-layout fit vertical>
                    <pl-flex-layout align="flex-end">
                        <pl-input label="Разделитель" value="{{csv.delimiter}}"></pl-input>
                        <pl-input label="Раздел" value="{{csv.unit}}"></pl-input>
                        <pl-input label="Уникальное поле" value="{{csv.uKey}}"></pl-input>
                        <pl-button label="Загрузить" on-click="[[onImportClick]]"></pl-button>
                    </pl-flex-layout>
                    <pl-flex-layout fit>
                        <pl-textarea value="{{csv.dataString}}" fit></pl-textarea>
                    </pl-flex-layout>
                </pl-flex-layout>
            </pl-tab>
        </pl-tabpanel>
        <pl-action id="aImportCsv" endpoint="/@nfjs/back-dbfw-ui-pl/simple-csv-import" args="[[csv]]"></pl-action>
    `;

    async onImportClick() {
        const res = await this.$.aImportCsv.execute();
        if (res.success) this.notify('Данные загружены.');
        else this.notify(res.error, { type: 'error', header: 'Данные не были загружены', icon: 'close-circle'});
    }
}
