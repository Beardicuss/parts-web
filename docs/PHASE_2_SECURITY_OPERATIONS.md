# Phase 2 security operations

## Security boundary

The browser route guard is only a usability control. Supabase RLS is the authorization
boundary. Catalog and storage mutations require:

1. a valid authenticated user;
2. a matching `public.admin_users.user_id`; and
3. an MFA-verified JWT with `aal2`.

Never add a write policy based only on `auth.role() = 'authenticated'`.

## One-time Supabase dashboard lockdown

In **Authentication → Providers**:

- Keep Email/Password enabled.
- Disable **Allow new users to sign up**.
- Disable anonymous sign-ins.
- Disable magic-link/OTP sign-in if it is not part of the recovery procedure.
- Disable every social, phone, and other unused provider.
- Keep secure email change enabled.

In **Authentication → Multi-Factor**:

- Enable TOTP enrollment and verification.
- Do not enable phone MFA unless the client explicitly accepts its ongoing cost and
  recovery dependency.

In **Storage settings**, keep the global upload limit at 8 MB or higher. The
`part-images` bucket itself is restricted to 8 MB and JPEG, PNG, or WebP by migration.

## Provision an administrator

Create the user manually in **Authentication → Users**, using a client-owned email. Then
run this in SQL Editor while signed in as the project owner:

```sql
insert into public.admin_users (user_id, note)
select id, 'Primary catalog administrator'
from auth.users
where lower(email) = lower('CLIENT_EMAIL_HERE')
on conflict (user_id) do update set note = excluded.note;
```

Confirm exactly the intended account was granted:

```sql
select au.user_id, u.email, au.created_at, au.note
from public.admin_users au
join auth.users u on u.id = au.user_id;
```

On first admin login, the website requires TOTP setup and a valid six-digit code before
catalog management becomes available.

## Remove access immediately

Remove membership first:

```sql
delete from public.admin_users
where user_id = (
  select id from auth.users where lower(email) = lower('FORMER_ADMIN_EMAIL_HERE')
);
```

Then revoke the user's active sessions or delete/disable the Auth user in the Supabase
dashboard. RLS blocks new writes immediately after membership removal, even if an old
browser session still displays admin navigation.

## MFA recovery

The client must retain ownership of the Supabase organization and project. If the admin
loses the authenticator:

1. The project owner verifies the administrator's identity out of band.
2. In Supabase Authentication, remove the lost TOTP factor or create a replacement Auth
   user.
3. Reapply the `admin_users` membership using the provisioning query.
4. The administrator signs in and enrolls a new authenticator.

Do not send passwords, TOTP setup keys, session tokens, or service-role keys through
source control, documentation, or ordinary chat.

## Deployment headers

`frontend/public/_headers` configures Cloudflare Pages response headers. After production
deployment, inspect the real response because repository configuration does not prove the
CDN applied it:

```powershell
curl.exe -I https://YOUR_PRODUCTION_DOMAIN/
```

Confirm CSP, `nosniff`, frame denial, referrer policy, permissions policy, and HSTS.
HSTS assumes the production domain and its subdomains are HTTPS-only.

## Dependency risk decision

As of 2026-07-27, npm reports the React Router RSC/server-action CSRF advisory as high
severity for the latest published `react-router-dom` version (`7.18.1`). This application
uses React Router only as a client-side SPA and has no React Server Components, framework
mode, server actions, or React Router server runtime, so the vulnerable feature is absent.
Downgrading to the audit-suggested `7.11.0` would reintroduce other router vulnerabilities.

Keep `7.18.1` pinned, continue failing CI for critical advisories, and upgrade as soon as
an upstream fixed release is available. The literal “zero known high advisories” Phase 2
gate remains pending until that release, even though this advisory is not reachable in
the deployed architecture.

## Authorization acceptance test

Use three accounts against a disposable Supabase project:

1. Anonymous browser: public reads succeed; table/storage mutations fail.
2. Authenticated non-admin: login may succeed, but admin membership lookup and every
   mutation fail.
3. Provisioned admin:
   - before MFA, writes fail;
   - after MFA verification, intended CRUD and image operations succeed;
   - after membership removal, writes fail without waiting for JWT expiry.

Run `supabase/tests/002_authorization.sql` to inspect policy and bucket configuration.
