import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class JournalSettings extends PlForm {
    static properties =  {
        formTitle: { type: String, value: 'Настройка журналирования' },
        journal: { value: () => ([]) },
        journalFiltered: { value: () => ([]) },
        filter: { type: String },
        isChange: { type: Boolean, value: false }
    }

    static css = css`
        pl-icon {
            cursor: pointer;
        }
    `;

    static template = html`
        <pl-flex-layout fit>
            <pl-grid data="{{journalFiltered}}" pkey-field="mdl" key-field="unit" tree>
                <pl-flex-layout stretch justify="space-between" slot="top-toolbar">
                    <pl-button label="Сохранить" variant="primary" disabled="[[!isChange]]" on-click="[[updData]]"></pl-button>
                <pl-input placeholder="Наименование раздела" value="{{filter}}">
                    <pl-icon slot="suffix" icon="search" iconset="pl-default" on-click="[[search]]"></pl-icon>
                </pl-input>
            </pl-flex-layout>
                    <pl-grid-column header="Имя раздела" field="caption" resizable></pl-grid-column>
                    <pl-grid-column header="Раздел" field="unit" resizable></pl-grid-column>
                    <pl-grid-column header="Добавление" width="250">
                        <template>
                            <pl-radio-group selected="{{row.need_add}}" hidden="[[!row.mdl]]">
                            <pl-radio-button label="Нет" name="n"></pl-radio-button>
                            <pl-radio-button label="Да" name="y"></pl-radio-button>
                            <pl-radio-button label="С данными" name="f"></pl-radio-button>
                            </pl-radio-group>
                        </template>
                    </pl-grid-column>
                    <pl-grid-column header="Удаление" width="250">
                        <template>
                            <pl-radio-group selected="{{row.need_del}}" hidden="[[!row.mdl]]">
                            <pl-radio-button label="Нет" name="n"></pl-radio-button>
                            <pl-radio-button label="Да" name="y"></pl-radio-button>
                            <pl-radio-button label="С данными" name="f"></pl-radio-button>
                            </pl-radio-group>
                        </template>
                    </pl-grid-column>
                    <pl-grid-column header="Изменение" width="250">
                        <template>
                            <pl-radio-group selected="{{row.need_upd}}" hidden="[[!row.mdl]]">
                            <pl-radio-button label="Нет" name="n"></pl-radio-button>
                            <pl-radio-button label="Да" name="y"></pl-radio-button>
                            <pl-radio-button label="С данными" name="f"></pl-radio-button>
                            </pl-radio-group>
                        </template>
                    </pl-grid-column>
                </pl-grid>
            </pl-flex-layout>
            <pl-data-observer data="{{journalFiltered}}" id="journalObs" is-changed="{{isChange}}"></pl-data-observer>
        </pl-flex-layout>
        <pl-action id="aSave" args="[[journal]]" paths="journal" endpoint="/@nfjs/front-pl/fse/admin.journal.settings/action/aSave"></pl-action>
        <pl-dataset id="dsJournal" data="{{journal}}" endpoint="/@nfjs/front-pl/fse/admin.journal.settings/dataset/dsJournal" args="[[_compose('...',flt)]]"></pl-dataset>
    `;

async onConnect() {
        setTimeout(async () => {
            await this.$.dsJournal.execute();
            this.journalFiltered = this.journal;
            this.obsSet();
        }, 0);
    }

    obsSet() {
        this.$.journalObs.reset();
        this.$.journalObs.snapshot();
    }

    async updData() {
        await this.$.aSave.execute({ journal: this.journalFiltered });
        this.obsSet();
    }

    search() {
        if (!this.filter) {
            this.journalFiltered = this.journal;
            return;
        }
        const filtered = this.journal.filter(row => row.caption.includes(this.filter));
        const parents = (item) => {
            const parent = this.journal.find(i => i.unit === item.mdl);
            if (parent) {
                if (filtered.indexOf(parent) === -1) filtered.push(parent);
                parents(parent);
            }
        }
        filtered.forEach(f => { parents(f); });
        this.journalFiltered = filtered;
    }

    serverEndpoints = {
        dataset: {
            dsJournal: {
                text: `with ex as (
                        select t.schemaname,
                               t.tablename,
                               t.args[1]::text as need_add,
                               t.args[2]::text as need_upd,
                               t.args[3]::text as need_del,
                               t.args[4]::bool as need_query
                               from (select tbn.nspname as schemaname,
                               tb.relname as tablename,
                               regexp_split_to_array(encode(tr.tgargs,'escape'),'\\\\000') as args
                          from pg_catalog.pg_trigger tr
                               join pg_catalog.pg_class tb on tb.oid = tr.tgrelid
                               join pg_catalog.pg_namespace tbn on tbn.oid = tb.relnamespace
                         where tr.tgname = 'tr8tables_actions') t)
                       select u.code as unit,
                              u.caption,
                              u.mdl,
                              split_part(u.code,'.',1) as schemaname,
                              split_part(u.code,'.',2) as tablename,
                              coalesce(ex.need_add, 'n') as need_add,
                              coalesce(ex.need_upd, 'n') as need_upd,
                              coalesce(ex.need_del,'n') as need_del,
                              coalesce(ex.need_query,false) as need_query
                         from nfc.v4unitlist u
                              left join ex on (ex.schemaname||'.'||ex.tablename = u.code)
                       union all
                       select s2.code::character varying(60),
                              s2.caption,
                              null::character varying(30),
                              null,
                              null,
                              null,
                              null,
                              null,
                              false
                         from nfc.v4modulelist s2
                        order by caption`
            }
        },
        action: {
            aSave: {
                journal: {
                    '@upd': {
                        action: 'nflog.f4tables_actions8switch',
                        args: {
                            p_schemaname: 'schemaname',
                            p_tablename: 'tablename',
                            p_add_opt: 'need_add',
                            p_upd_opt: 'need_upd',
                            p_del_opt: 'need_del',
                            p_store_query: 'need_query'
                        },
                        type: 'func'
                    }
                }
            }
        }
    }//serverEndpoints
}