CREATE TYPE role AS ENUM ('student', 'admin', 'mentor');
CREATE TYPE event_type AS ENUM ('hackathon', 'cp_solo', 'cp_team', 'mentorship');
CREATE TYPE event_status AS ENUM ('upcoming', 'live', 'past');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role role DEFAULT 'student',
  college_id TEXT,
  xp_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  type event_type NOT NULL,
  status event_status DEFAULT 'upcoming',
  poster_url TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  config JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  name TEXT NOT NULL,
  join_code TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  event_id UUID NOT NULL REFERENCES events(id),
  team_id UUID REFERENCES teams(id),
  assigned_category TEXT,
  preferences JSONB,
  custom_answers JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, event_id)
);

CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  domain TEXT NOT NULL,
  content JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id),
  week_number INTEGER NOT NULL,
  submission_content TEXT,
  mentor_feedback TEXT,
  is_approved BOOLEAN,
  created_at TIMESTAMP DEFAULT now()
);
