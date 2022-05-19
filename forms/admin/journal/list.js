import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class JournalList extends PlForm {
    static get properties() {
        return {
            formTitle: { type: String, value: 'Журнал событий с таблицами системы' },
            journal: { value: () => ([]) },
            actions: {
                type: Array,
                value: () => [
                    { value: 'a', text: 'Добавление' },
                    { value: 'u', text: 'Изменение' },
                    { value: 'd', text: 'Удаление' }
                ]
            },
            flt: {
                type: Object,
                value: () => ({})
            }
        }
    }

    static get template() {
        return html`
            <pl-flex-layout vertical fit>
                <pl-flex-layout>
                    <pl-button label="Обновить" variant="primary" on-click="[[refreshJournal]]">
                        <pl-icon slot="prefix" iconset="pl-default" icon="repeat"></pl-icon>
                    </pl-button>
                    <pl-button label="Настройка логов" variant="secondary" on-click="[[showLogSettings]]">
                        <pl-icon slot="prefix" iconset="pl-default" icon="settings"></pl-icon>
                    </pl-button>
                </pl-flex-layout>
                <pl-flex-layout fit>
                    <pl-grid data="{{journal}}" on-row-dblclick="[[viewLog]]" partial-data>
                        <pl-grid-column field="schemaname" header="Схема" resizable width="120"></pl-grid-column>
                        <pl-grid-column field="tablename" header="Раздел" resizable width="200"></pl-grid-column>
                        <pl-grid-column field="row_id" header="Id" sortable resizable width="200"></pl-grid-column>
                        <pl-grid-column field="session_user_name" header="Пользователь" resizable width="160"></pl-grid-column>
                        <pl-grid-column header="Дата и время выполнения действия" field="ts_log" format="DD.MM.YYYY HH:mm" resizable width="200"></pl-grid-column>
                        <pl-grid-column header="IP-адрес пользователя" field="client_addr" resizable></pl-grid-column>
                        <pl-grid-column header="Действие" resizable width="120">
                            <template>
                                <label>[[actionName(row.action)]]</label>
                            </template>
                        </pl-grid-column>
                        <pl-grid-column width="48" action>
                            <template>
                                <pl-icon-button iconset="pl-default" icon="paste" on-click="[[viewLog]]"></pl-icon-button>
                            </template>
                        </pl-grid-column>
                        <pl-flex-layout slot="top-toolbar" vertical>
                            <pl-filter-container id="fcJournal" data="{{journal}}">
                                <pl-flex-layout wrap>
                                    <pl-filter-item field="ts_log" id="dateTimefrom" operator=">=">
                                        <pl-datetime label="Дата и время с"></pl-datetime>
                                    </pl-filter-item>
                                    <pl-filter-item field="ts_log" id="dateTimeto" operator="<">
                                        <pl-datetime label="Дата и время по"></pl-datetime>
                                    </pl-filter-item>
                                    <pl-filter-item field="session_user_name" cast="lower">
                                        <pl-input label="Пользователь"></pl-input>
                                    </pl-filter-item>
                                    <pl-filter-item field="action" operator="=">
                                        <pl-combobox label="Действие" data="[[actions]]"></pl-combobox>
                                    </pl-filter-item>
                                    <pl-flex-layout>
                                        <pl-filter-item field="row_id" operator="=">
                                            <pl-input label="Id"></pl-input>
                                        </pl-filter-item>
                                        <pl-filter-item field="schemaname">
                                            <pl-input label="Схема"></pl-input>
                                        </pl-filter-item>
                                        <pl-filter-item field="tablename">
                                            <pl-input label="Раздел"></pl-input>
                                        </pl-filter-item>
                                    </pl-flex-layout>
                                </pl-flex-layout>
                                <label style="color: red;">Нижестоящие фильтры сильно нагружают базу данных</label>
                                <pl-flex-layout>
                                    <pl-filter-item is-param="true">
                                        <pl-input label="Имя поля раздела" value="{{flt.row_field}}"></pl-input>
                                    </pl-filter-item>
                                    <pl-filter-item is-param="true">
                                        <pl-input label="Значение поля раздела" value="{{flt.row_field_value}}"></pl-input>
                                    </pl-filter-item>
                                </pl-flex-layout>    
                            </pl-filter-container>
                        </pl-flex-layout>
                    </pl-grid>
                </pl-flex-layout>
            </pl-flex-layout>
            <pl-dataset id="dsJournal" data="{{journal}}" endpoint="/@nfjs/front-pl/fse/admin.journal.list/dataset/dsJournal" args="[[_compose('...',flt)]]"></pl-dataset>
		`;
    }

    onConnect() {
        setTimeout(() => {
            this.$.dsJournal.execute();
        },0);
    }

    showLogSettings() {
        this.open('admin.journal.settings')
    }

    viewLog(event) {
        this.open('admin.journal.view',{id: event.model.row.id });
    }

    refreshJournal() {
        this.$.fcJournal.applyFilters();
        this.$.dsJournal.execute();
    }

    actionName(action){
        switch (action){
            case 'a':
                return 'Добавление';
            case 'u':
                return 'Изменение';
            case 'd':
                return 'Удаление';
            default:
                return '';
        }
    }

    serverEndpoints = {
        dataset: {
            dsJournal: {
                text: `select tblactns.id,
                               tblactns.schemaname,
                               tblactns.tablename,
                               tblactns.session_user_name,
                               tblactns.ts_log,
                               tblactns.client_addr,
                               tblactns.action,
                               tblactns.row_id
                          from nflog.v4table_actions as tblactns
                        {{#if row_field}} where tblactns.row_data->>'{{row_field}}' = :row_field_value{{/if}}`
            }
        }
    }//serverEndpoints
}