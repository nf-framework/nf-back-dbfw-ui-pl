--[options]{"provider":"default"}
select id, role_id from nfc.v4userroles where user_id = :user_id and org_id = :org_id