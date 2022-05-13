import path from 'path';
import { api } from "@nfjs/core";
import { web } from '@nfjs/back';
import { registerCustomElementsDir } from '@nfjs/front-server';
import { endpointHandlers } from '@nfjs/front-pl';
import { endpointAccess } from './lib/endpoint-access.js';
import { addUser, addUserRole, delUserRole, getPasswordPolicy, delUser } from './lib/users.js';
import { addRole, delRole, checkRoleDelete, addMenuPerm, delMenuPerm, addUnitPriv, delUnitPriv, addUnitBpPriv, delUnitBpPriv } from './lib/roles.js';

const __dirname = path.join(path.dirname(decodeURI(new URL(import.meta.url).pathname))).replace(/^\\([A-Z]:\\)/, "$1");
let menu = await api.loadJSON(__dirname + '/menu.json');


const meta = {
    require: {
        after: ['@nfjs/front-pl', '@nfjs/back-dbfw'],
    }
};


async function init() {
    registerCustomElementsDir('@nfjs/back-dbfw-ui-pl/components');
    endpointHandlers.access = endpointAccess;
    // users
    web.on('POST', '/@nfjs/back-dbfw-ui-pl/addUser', { middleware: ['session', 'auth', 'json'] }, addUser);
    web.on('POST', '/@nfjs/back-dbfw-ui-pl/getPasswordPolicy', { middleware: ['session', 'auth', 'json'] }, getPasswordPolicy);
    web.on('POST', '/@nfjs/back-dbfw-ui-pl/delUser', { middleware: ['session', 'auth', 'json'] }, delUser);

    web.on('POST', '/@nfjs/back-dbfw-ui-pl/addUserRole', { middleware: ['session', 'auth', 'json'] }, addUserRole);
    web.on('POST', '/@nfjs/back-dbfw-ui-pl/delUserRole', { middleware: ['session', 'auth', 'json'] }, delUserRole);

    // roles
    web.on('POST', '/@nfjs/back-dbfw-ui-pl/roles/addRole', { middleware: ['session', 'auth', 'json'] }, addRole);
    web.on('POST', '/@nfjs/back-dbfw-ui-pl/roles/delRole', { middleware: ['session', 'auth', 'json'] }, delRole);
    web.on('POST', '/@nfjs/back-dbfw-ui-pl/roles/checkRoleDelete', { middleware: ['session', 'auth', 'json'] }, checkRoleDelete);

    web.on('POST', '/@nfjs/back-dbfw-ui-pl/roles/addMenuPerm', { middleware: ['session', 'auth', 'json'] }, addMenuPerm);
    web.on('POST', '/@nfjs/back-dbfw-ui-pl/roles/delMenuPerm', { middleware: ['session', 'auth', 'json'] }, delMenuPerm);

    web.on('POST', '/@nfjs/back-dbfw-ui-pl/roles/addUnitPriv', { middleware: ['session', 'auth', 'json'] }, addUnitPriv);
    web.on('POST', '/@nfjs/back-dbfw-ui-pl/roles/delUnitPriv', { middleware: ['session', 'auth', 'json'] }, delUnitPriv);
    web.on('POST', '/@nfjs/back-dbfw-ui-pl/roles/addUnitBpPriv', { middleware: ['session', 'auth', 'json'] }, addUnitBpPriv);
    web.on('POST', '/@nfjs/back-dbfw-ui-pl/roles/delUnitBpPriv', { middleware: ['session', 'auth', 'json'] }, delUnitBpPriv);

}

export {
    meta,
    init,
    menu
};
