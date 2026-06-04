-- NaNote Library — unified `item` model schema (idempotent)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- one row per knowledge artifact (company brief now; personal note in v0.2)
CREATE TABLE IF NOT EXISTS item (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind         text NOT NULL CHECK (kind IN ('company_brief','note')),
  external_id  text UNIQUE,                 -- company KbEntry.id (null for notes)
  dept         text,                        -- company DeptId (null for notes)
  category     text,                        -- company KbCategory or user category (null ok)
  summary      text NOT NULL DEFAULT '',
  highlight    text NOT NULL DEFAULT '',
  body_md      text NOT NULL DEFAULT '',    -- KbEntry.markdown / note body
  flags        jsonb NOT NULL DEFAULT '[]',
  artifacts    jsonb NOT NULL DEFAULT '[]', -- KbEntry.artifacts (rendered by ported chart primitives)
  source_date  date,                        -- KbEntry.date
  source_ts    timestamptz,                 -- KbEntry.ts
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  search       tsvector                     -- maintained from summary+highlight+body_md
);
CREATE INDEX IF NOT EXISTS item_search_idx   ON item USING gin (search);
CREATE INDEX IF NOT EXISTS item_dept_idx     ON item (dept);
CREATE INDEX IF NOT EXISTS item_category_idx ON item (category);
CREATE INDEX IF NOT EXISTS item_date_idx     ON item (source_date DESC);

-- user groupings ("category manager")
CREATE TABLE IF NOT EXISTS collection (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  color       text NOT NULL DEFAULT '#a78bfa',
  icon        text NOT NULL DEFAULT '◆',
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS collection_item (
  collection_id uuid REFERENCES collection(id) ON DELETE CASCADE,
  item_id       uuid REFERENCES item(id)       ON DELETE CASCADE,
  added_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (collection_id, item_id)
);

-- canonical tags (company tags seeded; user can add more)
CREATE TABLE IF NOT EXISTS tag (
  id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  slug  text UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS item_tag (
  item_id uuid REFERENCES item(id) ON DELETE CASCADE,
  tag_id  uuid REFERENCES tag(id)  ON DELETE CASCADE,
  source  text NOT NULL DEFAULT 'company' CHECK (source IN ('company','user')),
  PRIMARY KEY (item_id, tag_id)
);

-- per-item user state (single user in v0.1; user_id reserved for multi-user later)
CREATE TABLE IF NOT EXISTS item_state (
  item_id   uuid PRIMARY KEY REFERENCES item(id) ON DELETE CASCADE,
  user_id   text NOT NULL DEFAULT 'owner',
  pinned    boolean NOT NULL DEFAULT false,
  archived  boolean NOT NULL DEFAULT false,
  saved     boolean NOT NULL DEFAULT false,
  read      boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- import audit
CREATE TABLE IF NOT EXISTS sync_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at    timestamptz NOT NULL DEFAULT now(),
  finished_at   timestamptz,
  fetched_count int NOT NULL DEFAULT 0,
  upserted_count int NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'running' CHECK (status IN ('running','ok','error')),
  error         text
);

-- maintain item.search full-text vector on write
CREATE OR REPLACE FUNCTION item_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search := to_tsvector('english',
    coalesce(NEW.summary,'') || ' ' || coalesce(NEW.highlight,'') || ' ' || coalesce(NEW.body_md,''));
  RETURN NEW;
END $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS item_search_trg ON item;
CREATE TRIGGER item_search_trg BEFORE INSERT OR UPDATE ON item
  FOR EACH ROW EXECUTE FUNCTION item_search_update();
