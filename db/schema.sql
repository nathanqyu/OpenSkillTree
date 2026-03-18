-- =============================================================================
-- OpenSkillTree — Database Schema
-- Target: PostgreSQL 15+
-- See: /types/skill-tree.ts for the corresponding TypeScript type definitions
--
-- Tables:
--   skill_trees    — named collections of skills in a domain
--   skill_nodes    — individual skills within a tree
--   skill_edges    — prerequisite relationships between nodes (DAG)
--   user_progress  — user progress on nodes (deferred from MVP V1)
-- =============================================================================

-- Enable pgcrypto for gen_random_uuid() if not already loaded
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- skill_trees
-- -----------------------------------------------------------------------------

CREATE TABLE skill_trees (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(255)    NOT NULL,
    description TEXT            NOT NULL DEFAULT '',
    -- Free-text author display name (no auth in V1; becomes a FK in V2+)
    author      VARCHAR(255)    NOT NULL DEFAULT '',
    -- Top-level domain for browse/filter (e.g. 'Sports', 'Technology', 'Creative')
    domain      VARCHAR(100)    NOT NULL DEFAULT '',
    visibility  VARCHAR(20)     NOT NULL DEFAULT 'public'
                    CHECK (visibility IN ('public', 'unlisted', 'private')),
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skill_trees_domain      ON skill_trees (domain);
CREATE INDEX idx_skill_trees_visibility  ON skill_trees (visibility);
CREATE INDEX idx_skill_trees_created_at  ON skill_trees (created_at DESC);

-- Full-text search across title + description
CREATE INDEX idx_skill_trees_fts ON skill_trees
    USING GIN (to_tsvector('english', title || ' ' || description));

-- -----------------------------------------------------------------------------
-- skill_nodes
-- -----------------------------------------------------------------------------

CREATE TABLE skill_nodes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id     UUID            NOT NULL REFERENCES skill_trees (id) ON DELETE CASCADE,
    title       VARCHAR(255)    NOT NULL,
    description TEXT            NOT NULL DEFAULT '',
    -- Array of SkillBenchmark objects:
    --   [{ "level": "beginner", "criteria": "...", "metrics": ["..."] }, ...]
    -- At least one benchmark is required for a node to be considered complete.
    benchmarks  JSONB           NOT NULL DEFAULT '[]',
    -- Canvas coordinates for the graph visualization
    position_x  FLOAT           NOT NULL DEFAULT 0,
    position_y  FLOAT           NOT NULL DEFAULT 0,
    -- Optional icon: Lucide icon name, emoji, or image URL
    icon        VARCHAR(255),
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skill_nodes_tree_id    ON skill_nodes (tree_id);
CREATE INDEX idx_skill_nodes_benchmarks ON skill_nodes USING GIN (benchmarks);

-- Full-text search within a tree
CREATE INDEX idx_skill_nodes_fts ON skill_nodes
    USING GIN (to_tsvector('english', title || ' ' || description));

-- Enforce: benchmarks must be a JSON array
ALTER TABLE skill_nodes
    ADD CONSTRAINT chk_benchmarks_is_array
    CHECK (jsonb_typeof(benchmarks) = 'array');

-- -----------------------------------------------------------------------------
-- skill_edges
-- -----------------------------------------------------------------------------
-- Represents directed prerequisite relationships (source → target).
-- source must be completed before target becomes available.
-- The graph formed by these edges must be a DAG (no cycles).
-- Cycle prevention is the responsibility of the application layer.

CREATE TABLE skill_edges (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id         UUID NOT NULL REFERENCES skill_trees (id)  ON DELETE CASCADE,
    source_node_id  UUID NOT NULL REFERENCES skill_nodes (id)  ON DELETE CASCADE,
    target_node_id  UUID NOT NULL REFERENCES skill_nodes (id)  ON DELETE CASCADE,
    -- A given prerequisite pair must be unique within a tree
    CONSTRAINT uq_skill_edge UNIQUE (source_node_id, target_node_id),
    -- A node cannot be a prerequisite of itself
    CONSTRAINT chk_no_self_loop CHECK (source_node_id <> target_node_id)
);

CREATE INDEX idx_skill_edges_tree_id        ON skill_edges (tree_id);
CREATE INDEX idx_skill_edges_source_node_id ON skill_edges (source_node_id);
CREATE INDEX idx_skill_edges_target_node_id ON skill_edges (target_node_id);

-- -----------------------------------------------------------------------------
-- user_progress
-- -----------------------------------------------------------------------------
-- NOTE: Excluded from MVP V1. Ephemeral self-assessment is stored in the
-- browser session only. This table is defined here for completeness and future
-- use when authentication is added.

CREATE TABLE user_progress (
    user_id      VARCHAR(255)  NOT NULL,
    node_id      UUID          NOT NULL REFERENCES skill_nodes (id) ON DELETE CASCADE,
    status       VARCHAR(20)   NOT NULL DEFAULT 'locked'
                     CHECK (status IN ('locked', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, node_id),
    -- completed_at must be set iff status is 'completed'
    CONSTRAINT chk_completed_at
        CHECK (
            (status = 'completed' AND completed_at IS NOT NULL) OR
            (status <> 'completed' AND completed_at IS NULL)
        )
);

CREATE INDEX idx_user_progress_node_id ON user_progress (node_id);
CREATE INDEX idx_user_progress_user_id ON user_progress (user_id);

-- -----------------------------------------------------------------------------
-- updated_at trigger (auto-maintain updated_at on row updates)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_skill_trees_updated_at
    BEFORE UPDATE ON skill_trees
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_skill_nodes_updated_at
    BEFORE UPDATE ON skill_nodes
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
