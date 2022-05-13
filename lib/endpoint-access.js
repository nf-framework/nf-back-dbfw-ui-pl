import { common } from '@nfjs/core';
import { dbapi } from '@nfjs/back';

export async function endpointAccess(context) {
    const { cachedObj: access } = context;
    const res = {};
    const checkRoles = access?.['roles'] ?? [];
    const checkPrivs = access?.['privs'] ?? [];
    const checkOptions = access?.['options'] ?? [];
    if ((checkRoles.length + checkPrivs.length + checkOptions.length) > 0) {
        let connect;
        try {
            connect = await dbapi.getConnect(context);
            if (checkRoles.length > 0) {
                const queryRoles = await connect.query(
                    'select r.code, case when ur.role_id is null then false else true end as has from unnest(:roles::text[]) r(code) left join nfc.v4userroles8session ur on (ur.role_id_code = r.code)',
                    {roles: checkRoles}
                );
                res.roles = queryRoles.data && queryRoles.data.reduce((rls, r) => {
                    rls[r.code] = r.has;
                    return rls;
                }, {});
            }
            if (checkPrivs.length > 0) {
                const queryPrivs = await connect.query(
                    'select r.code, case when split_part(r.code,\'.\',3) = \'view\' then nfc.f4role_unitprivs8check(rtrim(r.code,\'.view\')) else nfc.f4role_unitbpprivs8check(r.code) end as has from unnest(:privs::text[]) r(code)',
                    {privs: checkPrivs}
                );
                res.privs = queryPrivs.data && queryPrivs.data.reduce((priv, p) => {
                    common.setPath(priv, p.code, p.has);
                    return priv;
                }, {});
            }
            if (checkOptions.length > 0) {
                const queryOptions = await connect.query(
                    'select r.code, nfc.f4options8get(r.code) as value from unnest(:options::text[]) r(code)',
                    {options: checkOptions}
                );
                res.options = queryOptions.data && queryOptions.data.reduce((opts, op) => {
                    opts[op.code] = op.value;
                    return opts;
                }, {});
            }
        } finally {
            if (connect) connect.release();
        }
    }
    return res;
}
