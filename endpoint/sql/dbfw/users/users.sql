--[options]{"provider":"default"}
select id, username, fullname from nfc.v4users
{{#if id}} where id = :id{{/if}}