--[options]{"provider":"default"}
select replace(u.code, u.unit||'.','') as action,
       u.unit,
       u.caption,
       (case when ub.id is null then false else true end) as exists
  from nfc.v4unitbps u
       left join nfc.v4role_unitbpprivs ub 
                 join nfc.v4role_unitprivs rb on (rb.id = ub.pid  and rb.role_id = :role_id) 
            on ub.unitbp = u.code    
 where replace(u.code, u.unit||'.','') not in ('add', 'upd', 'del')
   and u.use_privs = true
   and u.unit = :module order by action