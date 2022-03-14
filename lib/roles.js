import { dbapi } from "@nfjs/back";

export async function addRole(context) {
    const res = await dbapi.broker('nfc.roles.add', {
        code: context.body.args.code,
        caption: context.body.args.caption
    }, { context });

    context.send(res)
}

export async function delRole(context) {
    const res = await dbapi.broker('nfc.roles.del', { id: context.body.args.id }, { context });
    context.send(res)
}

export async function checkRoleDelete(context) {
    const res = await dbapi.query(`
        select string_agg(u.fullname,',' order by u.fullname) as usernames
            from nfc.v4userroles ur
            join nfc.v4users u on u.id = ur.user_id
        where ur.role_id = :role_id 
    `, {
        role_id: context.body.args.role_id
    }, { context: context });

    context.send({ data: res.data[0] })
}

export async function addMenuPerm(context) {
    const res = await dbapi.broker('nfc.menuroles.add', {
        role_id: context.body.args.role_id,
        menuguid: context.body.args.menuguid
    }, { context });

    context.send(res)
}

export async function delMenuPerm(context) {
    const res = await dbapi.broker('nfc.menuroles.del', { id: context.body.args.id }, { context });
    context.send(res)
}

export async function addUnitPriv(context) {
    const res = await dbapi.broker('nfc.role_unitprivs.add', {
        role_id: context.body.args.role_id,
        unit: context.body.args.unit
    }, { context });

    context.send(res)
}

export async function delUnitPriv(context) {
    const res = await dbapi.broker('nfc.role_unitprivs.del', { id: context.body.args.id }, { context });
    context.send(res)
}

export async function addUnitBpPriv(context) {
    const res = await dbapi.broker('nfc.role_unitbpprivs.add', {
        pid: context.body.args.pid,
        unitbp: context.body.args.unitbp
    }, { context });

    context.send(res)
}

export async function delUnitBpPriv(context) {
    const res = await dbapi.broker('nfc.role_unitbpprivs.del', { id: context.body.args.id }, { context });
    context.send(res)
}