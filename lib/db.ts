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
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
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
