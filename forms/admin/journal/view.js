import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class JournalView extends PlForm {
    static get properties() {
        return {
            formTitle: { type: String, value: 'Просмотр записи журнала' },
            data: { value: () => ({}) },
        }
    }

    static get template() {
        return html`
            <pl-flex-layout vertical fit>
                <pl-flex-layout vertical>
                    <pl-labeled-container label="Схема" variant="horizontal">[[data.schemaname]]</pl-labeled-container>
                    <pl-labeled-container label="Раздел" variant="horizontal">[[data.tablename]]</pl-labeled-container>
                    <pl-labeled-container label="Пользователь" variant="horizontal">[[data.session_user_name]]</pl-labeled-container>
                    <pl-labeled-container label="Дата и время" variant="horizontal">[[data.ts_log]]</pl-labeled-container>
                    <pl-labeled-container label="IP-адрес пользователя" variant="horizontal">[[data.client_addr]]</pl-labeled-container>
                    <pl-labeled-container label="Действие" variant="horizontal">[[data.action_caption]]</pl-labeled-container>
                </pl-flex-layout>
                <pl-flex-layout fit>
                    <pl-flex-layout fit>
                        <pl-card fit>
                            <pl-codeeditor value="[[data.row_data]]"></pl-codeeditor>
                            <label slot="header-prefix" content="[[calcRowDataTitle(data.action)]]"></label>
                        </pl-card>
                    </pl-flex-layout>
                    <pl-flex-layout fit hidden="[[hiddenChangedData(data.action)]]">
                        <pl-card header="Произведённые изменения" fit>
                            <pl-codeeditor value="[[data.row_changed_data]]"></pl-codeeditor>
                        </pl-card>
                    </pl-flex-layout>
                </pl-flex-layout>
            </pl-flex-layout>
            <pl-action id="aSelect" data="{{data}}" endpoint="/@nfjs/front-pl/fse/admin.journal.view/action/aSelect"></pl-action>
		`;
    }

    onConnect() {
        this.$.aSelect.execute({id: this.id});
    }

    calcRowDataTitle(action){
        if (action === 'a') return 'Внесенные значения';
        if (action === 'u') return 'Значения полей на начало изменений';
        return 'Значения полей перед удалением';
    }

    hiddenChangedData(value) {
        return value !== 'u';
    }

    serverEndpoints = {
        action: {
            aSelect: {
                '@main': {
                    action: `select t.id,
                                    t.schemaname,
                                    t.tablename,
                                    t.session_user_name,
                                    to_char(ts_log, 'dd.mm.yyyy') ts_log,
                                    t.client_addr,
                                    case
                                    when t.action = 'a' then 'Добавление'
                                    when t.action = 'u' then 'Изменение'
                                    when t.action = 'd' then 'Удаление'
                                    end as action_caption,
                                    t.action,
                                    jsonb_pretty(t.row_data) as row_data,
                                    jsonb_pretty(t.row_changed_data) as row_changed_data
                               from nflog.v4table_actions t
                              where t.id = :id`,
                    type: 'query'
                }
            }
        }
    }//serverEndpoints
}