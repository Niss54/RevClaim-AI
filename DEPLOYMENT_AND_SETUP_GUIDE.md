# RevClaim AI — Complete Deployment & Cloud Setup Guide

This guide covers the full setup for:
1. **Supabase Database & Authentication (GitHub + Google OAuth)**
2. **Docker Orchestration (Frontend + Backend)**
3. **Vercel Frontend Deployment**
4. **Render Backend & Fullstack Deployment**

---

## 1. Supabase Setup (Database & OAuth)

### Step 1.1: Run Database Schema & RLS Policies
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project (e.g. `ubpebgmzhgkzdbeblnmo`).
3. In the left navigation, click **SQL Editor**.
4. Click **New Query**, open `supabase/FULL_SETUP.sql` from this repository, copy its entire contents, and paste it into the editor.
5. Click **Run**.
   - This creates all 6 core tables (`profiles`, `organizations`, `debtors`, `invoices`, `call_sessions`, `settlements`).
   - Enables **Row Level Security (RLS)** with public demo access and authenticated user write policies.
   - Installs the `on_auth_user_created` trigger that automatically populates `public.profiles` and `public.organizations` whenever a user signs in via GitHub or Google.
   - Seeds realistic Hacker House Goa demo invoices.

---

### Step 1.2: Configure GitHub OAuth
1. Go to **[GitHub Developer Settings > OAuth Apps](https://github.com/settings/developers)**.
2. Click **New OAuth App**:
   - **Application name:** `RevClaim AI`
   - **Homepage URL:** `http://localhost:3000` (or your Vercel production URL, e.g. `https://revclaim-ai.vercel.app`)
   - **Authorization callback URL:** `https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback`
     *(Example: `https://ubpebgmzhgkzdbeblnmo.supabase.co/auth/v1/callback`)*
3. Click **Register application**.
4. Generate a **Client Secret** and copy both the **Client ID** and **Client Secret**.
5. In Supabase Dashboard:
   - Go to **Authentication > Providers > GitHub**.
   - Toggle **Enable GitHub**.
   - Paste your **Client ID** and **Client Secret**.
   - Click **Save**.

---

### Step 1.3: Configure Google OAuth
1. Go to **[Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials)**.
2. Click **Create Credentials > OAuth client ID**.
   - **Application type:** Web application
   - **Name:** `RevClaim AI`
   - **Authorized redirect URIs:** `https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback`
     *(Example: `https://ubpebgmzhgkzdbeblnmo.supabase.co/auth/v1/callback`)*
3. Click **Create** and copy your **Client ID** and **Client Secret**.
4. In Supabase Dashboard:
   - Go to **Authentication > Providers > Google**.
   - Toggle **Enable Google**.
   - Paste your **Client ID** and **Client Secret**.
   - Click **Save**.

---

### Step 1.4: Set Supabase Redirect URLs
1. In Supabase Dashboard, go to **Authentication > URL Configuration**.
2. Set **Site URL** to:
   - For Local Dev: `http://localhost:3000`
   - For Production: `https://<your-vercel-domain>.vercel.app`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/**`
   - `https://<your-vercel-domain>.vercel.app/**`
   - `https://<your-render-domain>.onrender.com/**`
4. Click **Save**.

---

## 2. Docker Setup (Local Orchestration)

Both the Next.js frontend and Python FastAPI backend are fully containerized.

### Prerequisites:
- Docker Desktop installed and running.

### Start All Services:
```bash
docker compose up --build
```

### Services Started:
- **FastAPI Python Backend:** `http://localhost:8000`
  - Health check: `http://localhost:8000/health`
  - Swagger docs: `http://localhost:8000/docs`
- **Next.js Frontend:** `http://localhost:3000`
  - Voice Dashboard, OAuth Sign-In, and Settlement interface.

To run in detached background mode:
```bash
docker compose up -d
```

To stop:
```bash
docker compose down
```

---

## 3. Vercel Deployment (Frontend)

1. Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Import the `Niss54/RevClaim-AI` repository.
3. Configure the **Build and Output Settings** (automatically detected as Next.js):
   - **Framework:** Next.js
   - **Root Directory:** `./`
4. Add the following **Environment Variables** in Vercel:
   | Variable | Value | Description |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Supabase Cloud URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_supabase_anon_key` | Supabase Anon Key |
   | `SUPABASE_SERVICE_ROLE_KEY` | `your_supabase_service_role_key` | Supabase Service Role Key |
   | `NEXT_PUBLIC_BACKEND_URL` | `https://revclaim-ai-backend.onrender.com` | Live Render Backend URL |
   | `NEXT_PUBLIC_APP_URL` | `https://<your-project>.vercel.app` | Vercel Live App URL |
   | `DEEPGRAM_API_KEY` | `your_deepgram_api_key` | Deepgram Nova-2 STT |
   | `MEM0_API_KEY` | `your_mem0_api_key` | Mem0 Episodic Memory |
   | `ELEVENLABS_API_KEY` | `your_elevenlabs_api_key` | ElevenLabs AI Voice |
   | `GEMINI_API_KEY` | `your_gemini_api_key` | Gemini LLM Engine |
   | `GROQ_API_KEY` | `your_groq_api_key` | Groq Llama 3.3 Engine |
5. Click **Deploy**.

---

## 4. Render Deployment (Backend & Fullstack)

The repository includes a ready-to-use `render.yaml` blueprint.

### Option A: Automatic via Render Blueprint
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New > Blueprint**.
3. Select `Niss54/RevClaim-AI`.
4. Render will parse `render.yaml` and provision:
   - `revclaim-ai-backend` (Python FastAPI on port `$PORT`)
   - `revclaim-ai-frontend` (Next.js 15)
5. Fill in the required secret environment keys in the Render UI.
6. Click **Apply**.

### Option B: Deploy Backend as Web Service
1. In Render, click **New > Web Service**.
2. Connect `Niss54/RevClaim-AI`.
3. Set:
   - **Language:** Python 3
   - **Root Directory:** (leave blank or `.`)
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn main:app --app-dir backend --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/health`
4. Add the environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DEEPGRAM_API_KEY`
   - `MEM0_API_KEY`
   - `ELEVENLABS_API_KEY`
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
5. Click **Create Web Service**.
