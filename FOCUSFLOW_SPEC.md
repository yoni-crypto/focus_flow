# FocusFlow — Full Project Specification

**IMPORTANT:** This is the permanent project specification. Always refer to this document.

## ✅ PROJECT NAME: FocusFlow

A premium, minimal, mobile-first productivity, finance, and daily habit system.

## ✅ TECH STACK

- Next.js 14/15/16 (whatever is installed)
- App Router
- TypeScript
- Tailwind
- Shadcn/UI
- Supabase (auth + database)
- PWA support
- Vercel hosting
- GitHub repo: yoni-crypto/focus_flow

## ✅ DESIGN REQUIREMENTS (STRICT)

- Not AI-generated UI
- No gradients
- No heavy shadows
- No neon/glow
- Pure premium Vercel / Linear style:
  - Clean spacing
  - Subtle borders
  - High contrast
  - Beautiful typography
  - Minimal icons
  - Mobile-first layouts
- Always use Shadcn components + custom tokens
- Animations: tiny, smooth, subtle (like Vercel dashboard)

## ✅ CORE FEATURES (v1.0)

### 1. Daily Planner
- tasks
- priorities (low, medium, high)
- due time
- swipe actions on mobile
- drag & drop on desktop

### 2. Focus Timer (Pomodoro)
- start / pause / reset
- count focused sessions
- track streak
- chart history (simple, minimal)

### 3. Budget + Savings Tracker
- daily spending input
- categories
- charts
- daily savings input
- monthly progress
- auto-calculate: remaining budget
- optionally add target goals

### 4. Notes (Quick Notes)
- small note cards
- pin / archive
- search

### 5. User Account
- Supabase auth
- email + password
- no OAuth needed for v1

## ✅ DATABASE SCHEMA (Supabase)

### users
- id | email | created_at

### tasks
- id | user_id | title | priority | date | completed | created_at

### focus_sessions
- id | user_id | start | end | duration_minutes | created_at

### money_entries
- id | user_id | type("spend" or "save") | amount | category | date | created_at

### notes
- id | user_id | title | content | pinned | created_at

## ✅ PROJECT SETUP TASKS (DO THESE STEP BY STEP)

### ✅ Step 1 — Initialize repo
- git init
- connect to GitHub repo yoni-crypto/focus_flow
- push initial project

### ✅ Step 2 — Setup Supabase
- create supabaseClient.ts
- add .env variables
- define all tables
- install supabase client
- create typed queries + actions
- server actions only, no client leakage

### ✅ Step 3 — Setup PWA
- add manifest
- add service worker
- add icons
- test mobile installation
- ensure offline fallback

### ✅ Step 4 — Global UI System
- typography presets
- spacing scale
- themes
- Shadcn components customization
- layout containers

### ✅ Step 5 — Authentication Flow
- login
- register
- reset password
- protected routes

### ✅ Step 6 — Build Dashboard Home
- show tasks for today
- show savings summary
- show focus stats
- show pinned notes
- mobile-first

### ✅ Step 7 — Daily Tasks Module
- CRUD + swipe actions + drag-drop + filters

### ✅ Step 8 — Focus Timer
- Clean minimal timer UI
- Start/pause/resume
- Save session automatically

### ✅ Step 9 — Money Tracker
- Input spend
- Input save
- Charts (no gradients)
- Categories

### ✅ Step 10 — Notes
- Create
- Edit
- Pin
- Delete
- Archive

### ✅ Step 11 — PWA Testing + Mobile Polish
- bottom nav bar (premium mobile feel)
- tablet layout
- offline behavior

## ✅ FINAL RULES

- Always use the saved memory: FOCUSFLOW_SPEC
- Never deviate from premium/minimal/Vercel-style design
- No gradients, no unnecessary shadows
- Always generate clean, professional code
- After each step, auto-commit and push to GitHub
- Ask me before adding anything not in the spec
- Work in strict steps, not everything at once
- Always remind me which step we are on

