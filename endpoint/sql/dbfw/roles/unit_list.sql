--[options]{"provider":"default"}
select s1.code as unit,
	 s1.caption,
	 s1.mdl,
	 false as view,
     false as add,
     false as upd,
     false as del,
     true as is_module,
     exists(select true from nfc.v4unitbps where unit = s1.code and code = s1.code||'.add') as is_module_add,
     exists(select true from nfc.v4unitbps where unit = s1.code and code = s1.code||'.upd') as is_module_upd,
     exists(select true from nfc.v4unitbps where unit = s1.code and code = s1.code||'.del') as is_module_del,
     exists (select true 
               from nfc.v4unitbps u
              where replace(u.code, u.unit||'.','') not in ('add', 'upd', 'del')
                and u.use_privs = true
                and u.unit = s1.code) as is_others,
                false as _hasChildren
from nfc.v4unitlist s1
union all
select s2.code::character varying(60),
  	 s2.caption,
  	 null::character varying(30),
     false as view,
     false as add,
     false as upd,
     false as del,
     false as is_module,
     false as is_module_add,
     false as is_module_upd,
     false as is_module_del,
     false,
     exists (select 1 from nfc.v4unitlist ul where ul.mdl = s2.code) as _hasChildren
from nfc.v4modulelist s2