# Cloud deployment

This setup does not require a computer to remain online:

- GitHub Pages hosts the React frontend.
- Render runs the FastAPI container.
- Neon stores the PostgreSQL data.

Never commit database URLs, passwords, encryption keys, or SMTP credentials. If a database URL is
shared accidentally, reset the database role password before deploying.

## 1. Create the Neon database

Create a Neon PostgreSQL project in the Frankfurt region and copy its connection string. Change the
URL scheme from `postgresql://` to `postgresql+asyncpg://`, and change `sslmode=require` to
`ssl=require` for this application:

```text
postgresql+asyncpg://USER:PASSWORD@HOST/DATABASE?ssl=require
```

Neon normally supplies `sslmode=require`. Because this application uses SQLAlchemy's `asyncpg`
dialect, rename that query parameter to `ssl=require`. If Neon also adds
`channel_binding=require`, remove that parameter because it is not accepted by this driver path.

Keep this value ready for the Render setup; do not put it in a repository file.

## 2. Deploy the API with the Render Blueprint

The repository's `render.yaml` describes the backend service. After pushing the repository changes:

1. Sign in to Render with GitHub.
2. Select **New -> Blueprint**.
3. Connect the `RootArYaN/Aryan_Dev_Port` repository.
4. Keep the Blueprint path as `render.yaml` and continue.
5. Enter the three secret values when Render prompts for them.

Use these values:

```text
DATABASE_URL=YOUR_ASYNCPG_NEON_URL
APP_ENCRYPTION_KEYS=YOUR_GENERATED_FERNET_KEY
ADMIN_PASSWORD=YOUR_UNIQUE_PASSWORD_OF_AT_LEAST_14_CHARACTERS
```

Generate the Fernet key from a trusted terminal:

```bash
cd apps/api
python3 scripts/generate_secrets.py
```

Copy only the `APP_ENCRYPTION_KEYS` value. Render generates `JWT_SECRET` and `IP_HASH_PEPPER`
automatically. The Blueprint configures the Dockerfile, free instance, Frankfurt region, port, health
check, CORS origin, cookies, and other non-secret settings.

The container startup is safe to repeat. It applies Alembic migrations, creates or refreshes the
configured administrator, and inserts starter projects that do not already exist. Existing projects
edited through the admin interface are not overwritten.

Wait for the Render deployment to show **Live**, then verify:

```text
https://YOUR-RENDER-SERVICE.onrender.com/api/v1/health/live
```

The first request can take about a minute because Render's free web services sleep after 15 minutes
without traffic.

## 3. Deploy the frontend on GitHub Pages

In the GitHub repository, open **Settings -> Pages** and select **GitHub Actions** as the source. Then
open **Settings -> Secrets and variables -> Actions -> Variables** and create:

```text
VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com/api/v1
```

Leave `VITE_BASE_PATH` unset for the normal GitHub project URL. Run the **Deploy frontend to GitHub
Pages** workflow from the Actions tab. Future pushes to `main` that change `apps/web` deploy
automatically.

The expected project URL is:

```text
https://rootaryan.github.io/Aryan_Dev_Port/
```

## 4. Email notifications

Email is intentionally disabled in the free Render setup. Render's free web services block outbound
SMTP ports `25`, `465`, and `587`, so Gmail SMTP cannot work there. Contact messages are still encrypted
and stored in Neon and can be viewed in the admin dashboard.

To add email later, either use an email provider with an HTTPS API or upgrade the backend to a Render
instance that permits SMTP. Do not add Gmail credentials to the free service because they cannot be
used successfully.

## Operational notes

- Use Neon rather than free Render Postgres: free Render PostgreSQL databases expire after 30 days.
- Free Render web services sleep while idle, so the first API request can be slow.
- `COOKIE_SAMESITE=none` is needed while the frontend and API use unrelated hostnames. Browsers that
  block third-party cookies can still prevent admin login.
- A custom domain with `www.example.com` and `api.example.com` makes admin authentication more
  reliable. With that arrangement, set `ALLOWED_ORIGINS` to the exact frontend origin, narrow
  `ALLOWED_HOSTS` to the API hostname, and change `COOKIE_SAMESITE` to `lax`.
