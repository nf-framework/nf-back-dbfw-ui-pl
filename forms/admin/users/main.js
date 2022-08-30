import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class SubscriberEdit extends PlForm {
    static properties = {
        user: {
            type: Object,
            value: () => ({
                username: undefined,
                fullname: undefined,
                password: undefined,
                password2: undefined
            }),
            observer: '_userObserver'
        },
        invalid: {
            value: false
        },
        checks: {
            type: Array,
            value: () => ([])
        },
        passwordPolicy: {
            type: Object,
            value: () => ({})
        },
        formTitle: {
            type: String,
            value: 'Добавление / редактирование пользователя'
        },
        action: {
            type: String
        }
    }

    static css = css`
        .error {
            color: var(--negative-base);
        }
    `;

    static template = html`
        <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
        <pl-flex-layout scrollable fit vertical>
            <pl-dom-if if="[[isMainDataVisible(action)]]">
                <template>
                    <pl-input orientation="horizontal" label="Имя пользователя" required value="{{user.username}}" hidden="[[usernameHidden(action)]]"></pl-input>
                    <pl-input orientation="horizontal" label="Фамилия Имя Отчество" required value="{{user.fullname}}"></pl-input>
                </template>
            </pl-dom-if>
            <pl-dom-if if="[[isPasswordVisible(action)]]">
                <template>
                    <pl-input orientation="horizontal" type="password" label="Пароль" required value="{{user.password}}"></pl-input>
                    <pl-input orientation="horizontal" type="password" label="Подтвердите пароль" required value="{{user.password2}}"></pl-input>
                        <template d:repeat="[[checks]]">
                            <span class="error">[[item]]<span>
                        </template>
                </template>
            </pl-dom-if>
            <pl-flex-layout>
                <pl-button label="Сохранить" variant="primary" disabled="[[computeDisabled(invalid,checks)]]" on-click="[[onSaveClick]]">
                    <pl-icon iconset="pl-default" size="16" icon="save" slot="suffix"></pl-icon>
                </pl-button>
                <pl-button label="Отменить" variant="secondary" on-click="[[close]]">
                    <pl-icon iconset="pl-default" size="16" icon="close-circle" slot="suffix"></pl-icon>
                </pl-button>
            </pl-flex-layout>
        </pl-flex-layout>
        <pl-action id="getPasswordPolicy" endpoint="@nfjs/back-dbfw-ui-pl/getPasswordPolicy" data="{{passwordPolicy}}"></pl-action>
        <pl-action id="aAdd" endpoint="@nfjs/back-dbfw-ui-pl/addUser"></pl-action>
        <pl-action id="aUpd" endpoint="@nfjs/back-dbfw-ui-pl/updUser"></pl-action>
        <pl-action id="aChangePassword" endpoint="@nfjs/back-dbfw-ui-pl/changePasswordUser"></pl-action>
        <pl-dataset id="dsUser" endpoint="/@nfjs/back/endpoint-sql/dbfw.users.users" type="sql-endpoint"></pl-dataset>
    `;

    async onConnect(){
        this.$.getPasswordPolicy.execute();
        if (this.action === 'upd') {
            const r = await this.$.dsUser.execute({id: this.id});
            this.set('user', r?.[0]);
        }
        if (this.action === 'change_password') {
            this.set('user.id', this.id);
        }
    }

    computeDisabled(invalid, checks) {
        return checks.length > 0 || invalid;
    }

    isMainDataVisible(action) {
        return action === 'add' || action === 'upd';
    }

    usernameHidden(action) {
        return action === 'upd';
    }

    isPasswordVisible(action) {
        return action === 'add' || action === 'change_password';
    }

    _userObserver(dat, old, mut) {
        if(mut.path == 'user.password'|| mut.path == 'user.password2') {
            const checks = [];
            const data = this.passwordPolicy;
            
            let password = this.user.password || '';
            let password2 = this.user.password2 || '';
            if (data) {
                if (data.pwd_minlength && 
                    password.length < data.pwd_minlength) {
                    checks.push(`Длина пароля должна быть ${data.pwd_minlength} и более символов`);
                }
                if (data.pwd_use_specs && 
                    new RegExp(/\W+/).test(password) === false) {
                    checks.push(`Пароль должен содержать спецсимволы`);
                }
                if (data.pwd_use_digit && 
                    new RegExp(/\d+/).test(password) === false) {
                    checks.push(`Пароль должен содержать цифры`);
                }
                if (data.pwd_use_shift && 
                    (new RegExp(/[A-ZА-ЯЁ]+/, 'u').test(password) === false
                    || new RegExp(/[a-zа-яё]+/, 'u').test(password) === false)) {
                    checks.push(`Пароль должен содержать разные регистры символов`);
                }
            }
            if (password !== password2 && password2.length > 0) {
                checks.push(`Пароли должны совпадать`);
            }
            
            this.set('checks', checks);
            return checks.length > 0;
        }
    }

    async onSaveClick() {
        const act = {add: this.$.aAdd, upd: this.$.aUpd, change_password: this.$.aChangePassword};
        act[this.action].execute(this.user)
            .then(() => {
                this.close();
            });
    }
}