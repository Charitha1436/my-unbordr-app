⚽ Player Analytics & Data Reconciliation Engine
A full-stack, type-safe web application built with Next.js (App Router), TypeScript, Prisma ORM, and PostgreSQL. The platform provides an end-to-end data ingestion pipeline to process raw match event CSV exports, reconcile duplicate player identities across age groups, and compute live appearance metrics.

🛠️ Tech Stack & Architecture
Framework: Next.js (App Router, Server Components, Server Actions)

Language: TypeScript

Database & ORM: PostgreSQL, Prisma ORM

Styling: Tailwind CSS

Deployment Target: Vercel / Neon PostgreSQL

🚀 Key Features & Implementation Details
1. Robust CSV Data Ingestion
What: Ingests raw match metrics from CSV files directly via Server Actions / API routes.

Why: Replaces tedious manual entry with an automated data pipeline that handles file parsing and transactional database updates.

How: Parses file streams directly on the server, mapping player names, age groups, positions, and match metrics directly into relational schema records.

2. Relational Schema & Entity Reconciliation
What: Reconciles raw match appearances with unified Player records.

Why: Players often participate across multiple age groups (U15, U17) or matches; metrics must be aggregated accurately per entity without duplicate entries.

How: Uses a 1-to-Many relationship between Player and Appearance models in Prisma. The engine matches unique player identifiers and appends newly ingested match appearance data dynamically.

3. Server-Side Metric Aggregations
What: Real-time computation of total appearances and minutes played.

Why: Offloads heavy mathematical calculations from the client, ensuring fast rendering and data integrity.

How: Queries relational appearances via Prisma (include: { appearances: true }) inside Server Components with immediate revalidation (export const revalidate = 0), computing cumulative stats on render.

📊 Database Schema Summary
Code snippet
model Player {
  id          String       @id @default(cuid())
  name        String
  ageGroup    String
  position    String
  appearances Appearance[]
  createdAt   DateTime     @default(now())
}

model Appearance {
  id            String   @id @default(cuid())
  playerId      String
  player        Player   @relation(fields: [playerId], references: [id], onDelete: Cascade)
  minutesPlayed Int      @default(0)
  goals         Int      @default(0)
  assists       Int      @default(0)
  createdAt     DateTime @default(now())
}
⚡ Getting Started
Prerequisites
Node.js: v18+

PostgreSQL Database Instance

Installation
Clone the repository:

Bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env file in the root directory and add your database string:

Code snippet
DATABASE_URL="postgresql://user:password@localhost:5432/player_db?schema=public"
Sync Database Schema:

Bash
npx prisma db push
Run Development Server:

Bash
npm run dev
Navigate to http://localhost:3000 to view the application.

🚢 Deployment Checklist
Push your repository to GitHub.

Deploy the project on Vercel.

Add the DATABASE_URL key in Vercel's Environment Variables settings.

Set the Build Command in Vercel to:

Bash
npx prisma generate && next build