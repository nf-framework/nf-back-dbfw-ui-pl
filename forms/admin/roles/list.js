import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class RoleList extends PlForm {
    static get properties() {
        return {
            menuList: { value: () => ([]), observer: '_menuListObserver' },
            menuPermList: { value: () => ([]), observer: '_menuPermObserver' },
            roles: { value: () => ([]) },
            activeRole: { value: () => undefined, observer: '_activeRoleObserver' },
            unitList: { value: () => ([]), observer: '_unitlistObserver' },
            rolePrivs: { value: () => ([]), observer: '_rolePrivsObserver' },
            activeRolePrivs: { value: () => undefined, observer: '_activeRolePrivObserver' },
            otherPrivs: { value: () => ([]), observer: '_othersRolePrivObserver' },
            formTitle: {
                type: String,
                value: 'Роли'
            }
        }
    }

    static get css() {
        return css`
            .main {
                flex: 2;
            }
            .others {
                flex: 1;
            }
        `
    }

    static get template() {
        return html`
            <pl-flex-layout fit vertical>
                <pl-flex-layout fit>
                    <pl-flex-layout fit>
                        <pl-grid data="{{roles}}" selected="{{activeRole}}" on-row-dblclick="[[onEditRoleClick]]">
                            <pl-flex-layout slot="top-toolbar">
                                <pl-button variant="primary" label="Добавить" on-click="[[onAddRoleClick]]">
                                    <pl-icon iconset="pl-default" size="16" icon="plus-circle" slot="prefix"></pl-icon>
                                </pl-button>
                            </pl-flex-layout>
                            <pl-grid-column sortable field="code" header="Код" width="150" resizable></pl-grid-column>
                            <pl-grid-column sortable field="caption" header="Наименование"></pl-grid-column>
                            <pl-grid-column width="90" action>
                                <template>
                                    <pl-flex-layout>
                                        <pl-icon-button variant="link" iconset="pl-default" size="16" icon="pencil" on-click="[[onEditRoleClick]]"></pl-icon-button>
                                        <pl-icon-button variant="link" iconset="pl-default" size="16" icon="trashcan" on-click="[[onDelRoleClick]]"></pl-icon-button>
                                    </pl-flex-layout>
                                </template>
                            </pl-grid-column>
                        </pl-grid>
                    </pl-flex-layout>
                    <pl-tabpanel>
                        <pl-tab header="Разделы и действия">
                            <pl-flex-layout fit vertical>
                                <pl-grid data="{{unitList}}" key-field="unit" pkey-field="mdl" class="main" selected="{{activeRolePrivs}}" tree>
                                <pl-grid-column field="caption" header="Раздел"></pl-grid-column>
                                <pl-grid-column width="80" header="Просмотр">
                                    <template>
                                            <pl-checkbox hidden="[[!row.is_module]]" variant="horizontal" checked="{{row.view}}"></pl-checkbox>
                                    </template>
                                </pl-grid-column>
                                <pl-grid-column width="90" header="Добавление">
                                    <template>
                                            <pl-checkbox hidden="[[!row.is_module_add]]" variant="horizontal" checked="{{row.add}}"></pl-checkbox>
                                    </template>
                                </pl-grid-column>
                                <pl-grid-column width="85" header="Обновление">
                                    <template>
                                            <pl-checkbox hidden="[[!row.is_module_upd]]" variant="horizontal" checked="{{row.upd}}"></pl-checkbox>
                                    </template>
                                </pl-grid-column>
                                <pl-grid-column width="75" header="Удаление">
                                    <template>
                                            <pl-checkbox hidden="[[!row.is_module_del]]" variant="horizontal" checked="{{row.del}}"></pl-checkbox>
                                    </template>
                                </pl-grid-column>
                                <pl-grid-column width="75" header="Другое">
                                    <template>
                                            <span hidden$="[[!row.is_others]]"> + </span>
                                    </template>
                                </pl-grid-column>
                            </pl-grid>
                            <pl-grid class="others" data="{{otherPrivs}}">
                                <pl-grid-column field="action" header="Действие"></pl-grid-column>
                                <pl-grid-column field="caption" header="Наименование"></pl-grid-column>
                                <pl-grid-column width="85">
                                    <template>
                                            <pl-checkbox variant="horizontal" checked="{{row.exists}}"></pl-checkbox>
                                    </template>
                                </pl-grid-column>
                            </pl-grid>
                            </pl-flex-layout>
                        </pl-tab>
                        <pl-tab header="Главное меню">
                            <pl-flex-layout fit>
                                <pl-grid data="{{menuList}}" key-field="id" pkey-field="pid" tree>
                                    <pl-grid-column field="caption" header="Наименование пункта меню"></pl-grid-column>
                                    <pl-grid-column width="100">
                                        <template>
                                                <pl-checkbox variant="horizontal" checked="{{row.exists}}" hidden="[[!row.guid]]"></pl-checkbox>
                                        </template>
                                    </pl-grid-column>
                                </pl-grid>
                            </pl-flex-layout>
                        </pl-tab>
                    </pl-tabpanel>
                </pl-flex-layout>
            </pl-flex-layout>
            <pl-dataset id="dsRoles" data="{{roles}}" endpoint="/@nfjs/back/endpoint-sql/dbfw.roles.roles"></pl-dataset>
            <pl-dataset id="dsUnitList" data="{{unitList}}" endpoint="/@nfjs/back/endpoint-sql/dbfw.roles.unit_list" type="sql-endpoint"></pl-dataset>
            <pl-dataset id="dsRoleUnitPrivs" data="{{rolePrivs}}" endpoint="/@nfjs/back/endpoint-sql/dbfw.roles.role_unit_privs" type="sql-endpoint"></pl-dataset>
            <pl-dataset id="dsRoleUnitPrivsOthers" data="{{otherPrivs}}" endpoint="/@nfjs/back/endpoint-sql/dbfw.roles.role_unit_privs_others" type="sql-endpoint"></pl-dataset>
            <pl-dataset id="dsFullMenu" data="{{menuList}}" endpoint="/front/action/getFullMenu"></pl-dataset>
            <pl-dataset id="dsMenuPerm" data="{{menuPermList}}" endpoint="/@nfjs/back/endpoint-sql/dbfw.roles.menu_perm" type="sql-endpoint"></pl-dataset>
            
            <pl-action id="aCheckRoleDel" endpoint="@nfjs/back-dbfw-ui-pl/roles/checkRoleDelete"></pl-action>
            <pl-action id="aDelRole" endpoint="@nfjs/back-dbfw-ui-pl/roles/delRole"></pl-action>
            
            <pl-action id="aAddMenuPerm" endpoint="@nfjs/back-dbfw-ui-pl/roles/addMenuPerm"></pl-action>
            <pl-action id="aDelMenuPerm" endpoint="@nfjs/back-dbfw-ui-pl/roles/delMenuPerm"></pl-action>
            
            <pl-action id="aAddUnitPriv" endpoint="@nfjs/back-dbfw-ui-pl/roles/addUnitPriv"></pl-action>
            <pl-action id="aDelUnitPriv" endpoint="@nfjs/back-dbfw-ui-pl/roles/delUnitPriv"></pl-action>
            <pl-action id="aAddUnitBpPriv" endpoint="@nfjs/back-dbfw-ui-pl/roles/addUnitBpPriv"></pl-action>
            <pl-action id="aDelUnitBpPriv" endpoint="@nfjs/back-dbfw-ui-pl/roles/delUnitBpPriv"></pl-action>
		`;
    }
    async onConnect() {
        this.$.dsFullMenu.execute();
        await this.$.dsRoles.execute()
        await this.$.dsUnitList.execute();
        this.activeRole = this.roles[0];
    }

    async onAddRoleClick() {
        await this.open('admin.roles.main');
        await this.$.dsRoles.execute();
        this.activeRole = this.roles[0];
    }

    async onEditRoleClick(event) {
        await this.open('admin.roles.main', { roleId: event.model.row.id });
        await this.$.dsRoles.execute();
        this.activeRole = this.roles[0];
    }

    async _activeRoleObserver(val) {
        if (val) {
            await this.$.dsRoleUnitPrivs.execute({ role_id: this.activeRole.id });
            if (this.activeRolePrivs) {
                this.$.dsRoleUnitPrivsOthers.execute({ role_id: this.activeRole.id, module: this.activeRolePrivs.unit });
            }
            this.$.dsMenuPerm.execute({ role_id: val.id });
        }
    }

    _unitlistObserver(data, old, mut) {
        if (!this._unitlistObserverFlag) return;
        const m = mut.path.match(/^unitList\.(\d*)\.(view|add|upd|del)$/);
        if (m) {
            const unit = data[m[1]].unit;
            const action = m[2];
            if (mut.value) {
                this.addPriv(unit, action);
            } else {
                this.delPriv(unit, action);
            }
        }
    }

    _rolePrivsObserver(data, old, m) {
        this._unitlistObserverFlag = false;
        this._othersObserverFlag = false;
        if (m.action === 'splice') {
            m.deleted?.forEach( i => {
                let r = this.unitList.findIndex( u => u.unit === i.unit);
                if (r>=0) this.set(`unitList.${r}.${i.action}`, false);
            });
            m.added?.forEach( i => {
                let r = this.unitList.findIndex( u => u.unit === i.unit);
                if (r>=0) this.set(`unitList.${r}.${i.action}`, true);
            });
        } else {
            for (let index = 0, n = this.unitList.length; index < n; index++) {
                const item = this.unitList[index];
                const privs = this.rolePrivs.filter(i => i.unit === item.unit)
                this.set(`unitList.${index}.view`, !!privs.find(p => p.action === 'view'));
                this.set(`unitList.${index}.add`, !!privs.find(p => p.action === 'add'));
                this.set(`unitList.${index}.upd`, !!privs.find(p => p.action === 'upd'));
                this.set(`unitList.${index}.del`, !!privs.find(p => p.action === 'del'));
            }
        }

        this._unitlistObserverFlag = true;
        this._othersObserverFlag = true;
    }

    _othersRolePrivObserver(data, old, mut) {
        if (!this._othersObserverFlag) return;
        const m = mut.path.match(/^otherPrivs\.(\d*)\.exists$/);
        if (m) {
            const unit = data[m[1]].unit;
            const action = data[m[1]].action;
            if (mut.value) {
                this.addPriv(unit, action);
            } else {
                this.delPriv(unit, action);
            }
        }
    }

    _activeRolePrivObserver(val) {
        if (val) {
            this.$.dsRoleUnitPrivsOthers.execute({ role_id: this.activeRole.id, module: val.unit })
        }
    }

    _menuListObserver(data, old, mut) {
        if (!this._menuPermsFlag) return;
        const m = mut.path.match(/^menuList\.(\d*)\.exists$/);
        if (m) {
            if (mut.value) {
                this.$.aAddMenuPerm.execute({
                    role_id: this.activeRole.id,
                    menuguid: this.menuList[m[1]].guid
                }).then((res) => {
                    this.set(`menuList.${m[1]}.rolePermId`, res.id);
                });
            }
            else {
                this.$.aDelMenuPerm.execute({ id: this.menuList[m[1]].rolePermId });
            }
        }
    }

    _menuPermObserver() {
        this._menuPermsFlag = false;
        for (let index = 0, n = this.menuList.length; index < n; index++) {
            const item = this.menuList[index];
            const perm = this.menuPermList.filter(i => i.menuguid === item.guid);
            this.set(`menuList.${index}.exists`, perm.length > 0);
            if (perm.length > 0) {
                this.set(`menuList.${index}.rolePermId`, perm[0].id);
            }
        }
        this._menuPermsFlag = true;
    }

    addPriv(unit, action) {
        return new Promise((resolve, reject) => {
            const unitlistIndex = this.unitList.findIndex((item) => item.unit === unit);
            const role_id = this.activeRole.id;
            const viewPriv = this.rolePrivs.find(item => item.unit === unit && item.action === 'view');
            if (action === 'view') {
                this.$.aAddUnitPriv.execute({ role_id, unit })
                    .then((res) => {
                        this._privsObserverFlag = false;
                        this._unitlistObserverFlag = false;
                        this.push('rolePrivs', { id: res.id, unit, action });
                        this.set(`unitList.${unitlistIndex}.${action}`, true);
                        this._privsObserverFlag = true;
                        this._unitlistObserverFlag = true;

                        resolve();
                    })
                    .catch((e) => {
                        console.error('error', e);
                        this.$.dsRoleUnitPrivs.execute({ role_id: this.activeRole.id }).then(reject);
                        reject();
                    });
            } else {
                if (!viewPriv) {
                    this.addPriv(unit, 'view')
                        .then((res) => {
                            Promise.resolve(this.addPriv(unit, action))
                                .then(resolve)
                                .catch(reject);
                        })
                        .catch(reject);
                    return;
                }

                this.$.aAddUnitBpPriv.execute({ pid: viewPriv.id, unitbp: `${unit}.${action}` })
                    .then((res) => {
                        this._privsObserverFlag = false;
                        this._unitlistObserverFlag = false;
                        this.push('rolePrivs', { id: res.id, unit, action });
                        this.set(`unitList.${unitlistIndex}.action`, true);
                        this._privsObserverFlag = true;
                        this._unitlistObserverFlag = true;

                        resolve();
                    })
                    .catch((e) => {
                        console.error('error', e);
                        this.$.dsRoleUnitPrivs.execute({ role_id: this.activeRole.id }).then(reject);
                        reject();
                    });
            }
        });
    }
    async fDelPriv(id, bp = false ) {
        if (bp) {
            await this.$.aDelUnitBpPriv.execute({id});
        } else {
            await this.$.aDelUnitPriv.execute({id});
        }
        this._privsObserverFlag = false;
        const privIndex = this.rolePrivs.findIndex(item => item.id == id );
        this.splice('rolePrivs', privIndex, 1);
        this._privsObserverFlag = true;
    }

    async delPriv(unit, action) {

        try {
            if (action === 'view') {
                let acts = this.rolePrivs.filter(item => item.unit === unit && item.action !== 'view');
                let promises = acts.map((i) => this.fDelPriv(i.id, true));
                await Promise.all(promises);
                let priv = this.rolePrivs.find(i => i.unit === unit && i.action === action);
                this.fDelPriv(priv.id);
            } else {
                let priv = this.rolePrivs.find(i => i.unit === unit && i.action === action);
                if (!priv) return;
                await this.fDelPriv(priv.id, true)
            }
        } catch (e) {
            console.error('error', e);
            this.$.dsRoleUnitPrivs.execute({ role_id: this.activeRole.id });
        }

    }

    async onDelRoleClick(event) {
        const resConfirm = await this.showConfirm(`Вы уверены что хотите удалить роль "${event.model.row.caption}"?`, {
            buttons: [{
                label: 'Нет',
                variant: 'secondary',
                action: false,
            },
            {
                label: 'Удалить',
                variant: 'primary',
                negative: true,
                action: true
            }]
        })
        if (resConfirm) {
            const resCheck = await this.$.aCheckRoleDel.execute({ role_id: event.model.row.id });
            const { usernames } = resCheck;
            if (usernames) {
                this.showAlert(`Роль назначена следующим пользователям: [${usernames}]. Необходимо удалить назначение роли пользователям.`);
            } else {
                await this.$.aDelRole.execute({ id: event.model.row.id });
                this.$.dsRoles.execute().then(() => {
                    this.activeRole = this.roles[0];
                });
            }
        }
    }
}