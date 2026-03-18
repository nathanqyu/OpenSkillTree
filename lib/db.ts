import { Pool, PoolClient } from "pg";

/**
 * Singleton Postgres connection pool.
 *
 * Configuration via environment variables:
 *   DATABASE_URL  — full connection string (preferred), e.g.:
 *                   postgres://user:pass@localhost:5432/openskill
 *
 *   Alternatively set individual vars:
 *   PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
 *
 * In Next.js, put these in .env.local (not committed to git).
 */

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    // Require SSL when connecting to hosted Postgres (Neon/Vercel Postgres).
    // Local Docker Compose connections use plain TCP — skip SSL if ?sslmode=disable
    // or if the URL does not contain a cloud host indicator.
    const isHosted =
      connectionString &&
      !connectionString.includes("localhost") &&
      !connectionString.includes("127.0.0.1");

    pool = new Pool({
      connectionString,
      // Serverless functions are short-lived: keep max connections low to avoid
      // exhausting Neon's PgBouncer slots. Each Next.js API route invocation
      // shares this pool within one Node.js process lifetime.
      max: isHosted ? 1 : 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl: isHosted ? { rejectUnauthorized: false } : false,
    });

    pool.on("error", (err) => {
      console.error("Unexpected Postgres pool error:", err);
    });
  }
  return pool;
}

/** Execute a query against the pool, returning all rows. */
export async function query<T extends object = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await getPool().query<T>(sql, params);
  return result.rows;
}

/**
 * Execute multiple queries in a single transaction.
 * Rolls back automatically on error.
 */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
