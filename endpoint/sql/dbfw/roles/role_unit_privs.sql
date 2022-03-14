--[options]{"provider":"default"}
select id, unit, 'view' as action
  from nfc.v4role_unitprivs
 where role_id = :role_id
  union
select ubp.id, ubp.unitbp_unit, replace(ubp.unitbp,ubp.unitbp_unit||'.','')
  from nfc.v4role_unitprivs up
       left join nfc.v4role_unitbpprivs ubp on ubp.pid = up.id
 where up.role_id = :role_id