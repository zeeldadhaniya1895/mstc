
-- Enums
CREATE TYPE "role" AS ENUM ('student', 'member', 'core_member', 'deputy_convener', 'convener');
CREATE TYPE "event_type" AS ENUM ('hackathon', 'cp_solo', 'cp_team', 'mentorship');
CREATE TYPE "event_status" AS ENUM ('upcoming', 'live', 'past');

-- Users Table (Renamed to user to match Auth.js default)
CREATE TABLE IF NOT EXISTS "user" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" text NOT NULL UNIQUE,
    "name" text,
    "emailVerified" timestamp,
    "image" text,
    "role" "role" DEFAULT 'student',
    "college_id" text,
    "xp_points" integer DEFAULT 0,
    "created_at" timestamp DEFAULT now()
);

-- NextAuth Tables
CREATE TABLE IF NOT EXISTS "account" (
    "userId" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "type" text NOT NULL,
    "provider" text NOT NULL,
    "providerAccountId" text NOT NULL,
    "refresh_token" text,
    "access_token" text,
    "expires_at" integer,
    "token_type" text,
    "scope" text,
    "id_token" text,
    "session_state" text,
    CONSTRAINT "account_provider_providerAccountId_pk" UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "session" (
    "sessionToken" text PRIMARY KEY,
    "userId" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "expires" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "verificationToken" (
    "identifier" text NOT NULL,
    "token" text NOT NULL,
    "expires" timestamp NOT NULL,
    CONSTRAINT "verificationToken_identifier_token_pk" UNIQUE ("identifier", "token")
);

-- Events Table
CREATE TABLE IF NOT EXISTS "events" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "slug" text NOT NULL UNIQUE,
    "title" text NOT NULL,
    "type" "event_type" NOT NULL,
    "status" "event_status" DEFAULT 'upcoming',
    "poster_url" text,
    "start_date" timestamp,
    "end_date" timestamp,
    "config" jsonb, -- Stores dynamic form fields and rules
    "created_at" timestamp DEFAULT now()
);

-- Teams Table
CREATE TABLE IF NOT EXISTS "teams" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "event_id" uuid NOT NULL REFERENCES "events"("id"),
    "name" text NOT NULL,
    "join_code" text NOT NULL,
    "created_by" uuid NOT NULL REFERENCES "user"("id"),
    "created_at" timestamp DEFAULT now()
);

-- Registrations Table
CREATE TABLE IF NOT EXISTS "registrations" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid NOT NULL REFERENCES "user"("id"),
    "event_id" uuid NOT NULL REFERENCES "events"("id"),
    "team_id" uuid REFERENCES "teams"("id"),
    "assigned_category" text,
    "preferences" jsonb,
    "custom_answers" jsonb,
    "status" text DEFAULT 'pending',
    "created_at" timestamp DEFAULT now(),
    CONSTRAINT "registrations_user_id_event_id_unique" UNIQUE ("user_id", "event_id")
);

-- Roadmaps Table
CREATE TABLE IF NOT EXISTS "roadmaps" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "event_id" uuid NOT NULL REFERENCES "events"("id"),
    "domain" text NOT NULL,
    "content" jsonb,
    "created_at" timestamp DEFAULT now()
);

-- Checkpoints Table
CREATE TABLE IF NOT EXISTS "checkpoints" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "registration_id" uuid NOT NULL REFERENCES "registrations"("id"),
    "week_number" integer NOT NULL,
    "submission_content" text,
    "mentor_feedback" text,
    "is_approved" boolean,
    "created_at" timestamp DEFAULT now()
);
