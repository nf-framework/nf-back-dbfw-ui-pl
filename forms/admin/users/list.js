import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class UserList extends PlForm {
    static properties = {
        users: { value: () => ([]) },
        roles: { value: () => ([]), observer: '_rolesObserver' },
        orgs: { value: () => ([]), observer: '_orgsObserver' },
        org_id: { value: () => undefined },
        _is_org: { value: true },
        selectedUser: { value: () => undefined, observer: '_selectedUserObserver' },
        userRoles: { value: () => ([]), observer: '_userRolesObserver' },
        formTitle: {
            type: String,
            value: 'Пользователи и роли'
        }
    }

    static template = html`
        <pl-flex-layout fit vertical>
            <pl-flex-layout stretch justify="space-between">
                <pl-flex-layout>
                    <pl-button variant="primary" label="Добавить" on-click="[[onAddUserClick]]">
                        <pl-icon iconset="pl-default" size="16" icon="plus-circle" slot="prefix"></pl-icon>
                    </pl-button>
                    <pl-button variant="secondary" label="Права и роли" on-click="[[onRolesClick]]">
                        <pl-icon iconset="pl-default" size="16" icon="settings" slot="prefix"></pl-icon>
                    </pl-button>
                </pl-flex-layout>
                <pl-combobox orientation="horizontal" data="{{orgs}}" label="Организация" text-property="caption" value-property="id" value="{{org_id}}"></pl-combobox>
            </pl-flex-layout>
            <pl-flex-layout fit>
                <pl-flex-layout fit>
                    <pl-grid data="{{users}}" selected="{{selectedUser}}">
                        <pl-grid-column sortable field="username" header="Пользователь" width="200" resizable></pl-grid-column>
                        <pl-grid-column sortable field="fullname" header="ФИО"></pl-grid-column>
                        <pl-grid-column width="98" action>
                            <template>
                                <style>
                                    pl-flex-layout {
                                        gap: 0px;
                                    }
                                </style>
                                <pl-flex-layout>
                                    <pl-icon-button variant="link" iconset="pl-default" size="16" icon="pencil" on-click="[[onUpdUserClick]]"></pl-icon-button>
                                    <pl-icon-button variant="link" iconset="pl-default" size="16" icon="eye-closed" on-click="[[onChangePasswordUserClick]]"></pl-icon-button>
                                    <pl-icon-button variant="link" iconset="pl-default" size="16" icon="trashcan" on-click="[[onDeleteUserClick]]"></pl-icon-button>
                                </pl-flex-layout>
                            </template>
                        </pl-grid-column>
                    </pl-grid>
                </pl-flex-layout>
                <pl-flex-layout fit>
                    <pl-grid data="{{roles}}">
                        <pl-grid-column sortable field="caption" header="Роль"></pl-grid-column>
                        <pl-grid-column width="50">
                            <template>
                                <pl-checkbox disabled="[[!selectedUser]]" checked="{{row.exists}}"></pl-checkbox>
                            </template>
                        </pl-grid-column>
                    </pl-grid>
                </pl-flex-layout>
            </pl-flex-layout>
        </pl-flex-layout>
        <pl-dataset id="dsUsers" data="{{users}}" endpoint="/@nfjs/back/endpoint-sql/dbfw.users.users" type="sql-endpoint"></pl-dataset>
        <pl-dataset id="dsOrgs" data="{{orgs}}" endpoint="/@nfjs/back/endpoint-sql/dbfw.users.orgs" type="sql-endpoint"></pl-dataset>
        <pl-dataset id="dsRoles" data="{{roles}}" endpoint="/@nfjs/back/endpoint-sql/dbfw.users.roles" type="sql-endpoint"></pl-dataset>
        <pl-dataset id="dsUserRoles" data="{{userRoles}}" endpoint="/@nfjs/back/endpoint-sql/dbfw.users.user_roles" type="sql-endpoint"></pl-dataset>

        <pl-action id="aDelUser" endpoint="@nfjs/back-dbfw-ui-pl/delUser"></pl-action>
        <pl-action id="aAddUserRole" endpoint="@nfjs/back-dbfw-ui-pl/addUserRole"></pl-action>
        <pl-action id="aDelUserRole" endpoint="@nfjs/back-dbfw-ui-pl/delUserRole"></pl-action>
    `;

    onConnect() {
        this.$.dsUsers.execute();
        this.$.dsRoles.execute();
        this.$.dsOrgs.execute();
        this._userRolesFlag = true;
        this._rolesFlag = true;
    }

    _orgsObserver(orgs) {
        if (orgs.length > 0) {
            this.org_id = orgs[0].id;
        }
    }

    _selectedUserObserver(selected) {
        if (selected)
            this.$.dsUserRoles.execute({
                user_id: selected.id,
                org_id: this.org_id
            });
    }

    _userRolesObserver(data) {
        if (!data || !this._userRolesFlag) return;

        this._rolesFlag = false;

        for (let index = 0, n = this.roles.length; index < n; index++) {
            const roleExist = !!data.find(i => i.role_id === this.roles[index].id);
            this.set(`roles.${index}.exists`, roleExist);
        }

        this._rolesFlag = true;
    }

    _rolesObserver(data, old, mut) {
        if (!data || !this._rolesFlag) return;

        const m = mut.path.match(/^roles\.(\d*)\.exists$/);
        if (this.selectedUser && m) {
            const params = {
                org_id: this.org_id,
                user_id: this.selectedUser.id,
                role_id: data[m[1]].id,
            };
            if (mut.value) {
                this.$.aAddUserRole.execute({ ...params })
                    .then((res) => {
                        this._userRolesFlag = false;
                        this._rolesFlag = false;
                        this.push('userRoles', { id: res.id, role_id: params.role_id });
                        this.set(mut.path, true);
                        this._userRolesFlag = true;
                        this._rolesFlag = true;
                    });
            } else {
                const userRole = this.userRoles.find(i => i.role_id === params.role_id);

                this.$.aDelUserRole.execute({ id: userRole.id })
                    .then((res) => {
                        const uRoleIndex = this.userRoles.findIndex(i => i.role_id === params.role_id);

                        this._userRolesFlag = false;
                        this._rolesFlag = false;
                        this.splice('userRoles', uRoleIndex, 1);
                        this.set(mut.path, false);
                        this._userRolesFlag = true;
                        this._rolesFlag = true;
                    });
            }
        }
    }

    async onAddUserClick() {
        await this.open('admin.users.main', {action: 'add'});
        this.$.dsUsers.execute();
    }

    async onUpdUserClick(event) {
        await this.open('admin.users.main', {action: 'upd', id: event.model.row.id});
        this.$.dsUsers.execute();
    }

    async onChangePasswordUserClick(event) {
        await this.open('admin.users.main', {action: 'change_password', id: event.model.row.id});
    }

    async onDeleteUserClick(event) {
        const resConfirm = await this.showConfirm(`Вы уверены что хотите удалить пользователя "${event.model.row.fullname}"?`, {
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
        });

        if (resConfirm) {
            await this.$.aDelUser.execute({ id: event.model.row.id });
            this.$.dsUsers.execute();
        }
    }

    async onRolesClick() {
        await this.open('admin.roles.list'); 
        await this.$.dsRoles.execute();
        this.selectedUser = this.users[0];
        this.$.dsUserRoles.execute({
            user_id: this.selectedUser.id,
            org_id: this.org_id
        });
    }
}