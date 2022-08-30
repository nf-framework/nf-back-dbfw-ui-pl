import { dbapi } from "@nfjs/back";
import { config } from "@nfjs/core";

const logonKind = config?.data_providers?.default?.connectType ?? 'user';

export async function addUser(context) {
    const res = await dbapi.func('nfc.f4users8save', {
        username: context.body.args.username,
        fullname: context.body.args.fullname,
        password: context.body.args.password,
        org: context.session.get('context.org'),
        extra: { logonKind }
     }, { context });
    context.send(res)
}

export async function updUser(context) {
    const res = await dbapi.broker('nfc.users.upd', {
        id: context.body.args.id,
        org: context.session.get('context.org'),
        fullname: context.body.args.fullname,
    }, { context });
    context.send(res)
}

export async function delUser(context) {
    const res = await dbapi.broker('nfc.users.del', { id: context.body.args.id, org: context.session.get('context.org') }, { context });
    context.send(res)
}

export async function changePassword(context) {
    const res = await dbapi.func('nfc.f4users8change_password', {
        org: context.session.get('context.org'),
        id: context.body.args.id,
        password: context.body.args.password
    }, { context });
    context.send(res)
}

export async function getPasswordPolicy(context) {
    const data = await dbapi.query(`
        SELECT id, code, caption, attempts_to_lock, pwd_locktime, pwd_lifetime, pwd_minlength, pwd_use_specs, pwd_use_digit, pwd_use_shift, pwd_chk_block, pwd_chk_block_remark
    FROM nfc.v4password_policy where code = 'default';
    `, {}, { context })

    context.send(data)
}


export async function addUserRole(context) {
    const res = await dbapi.broker('nfc.userroles.add', { 
        org_id: context.body.args.org_id,
        user_id: context.body.args.user_id,
        role_id: context.body.args.role_id
     }, { context });

    context.send(res)
}

export async function delUserRole(context) {
    const res = await dbapi.broker('nfc.userroles.del', { id: context.body.args.id }, { context });
    context.send(res)
}