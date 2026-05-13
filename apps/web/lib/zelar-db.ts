import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL_ZELAR;
    if (!connectionString) {
      throw new Error('DATABASE_URL_ZELAR não configurado');
    }
    pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

export interface ZelarStats {
  totalUsers: number;
  newUsersLast7Days: number;
  totalHouseholds: number;
  proHouseholds: number;
  totalTasks: number;
}

export interface ZelarUser {
  name: string;
  email: string;
  createdAt: Date;
  deletedAt: Date | null;
  householdName: string | null;
  planName: string | null;
}

export async function getZelarStats(): Promise<ZelarStats> {
  const db = getPool();

  const [
    totalUsersRes,
    newUsersRes,
    totalHouseholdsRes,
    proHouseholdsRes,
    totalTasksRes,
  ] = await Promise.all([
    db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM "user" WHERE deleted_at IS NULL AND is_anonymized = false`
    ),
    db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM "user"
       WHERE created_at >= NOW() - INTERVAL '7 days'
         AND deleted_at IS NULL AND is_anonymized = false`
    ),
    db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM household`
    ),
    db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM household h
       JOIN plan p ON h.plan_id = p.id
       WHERE p.name = 'PRO'`
    ),
    db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM task`
    ),
  ]);

  return {
    totalUsers: parseInt(totalUsersRes.rows[0].count, 10),
    newUsersLast7Days: parseInt(newUsersRes.rows[0].count, 10),
    totalHouseholds: parseInt(totalHouseholdsRes.rows[0].count, 10),
    proHouseholds: parseInt(proHouseholdsRes.rows[0].count, 10),
    totalTasks: parseInt(totalTasksRes.rows[0].count, 10),
  };
}

export async function getRecentZelarUsers(): Promise<ZelarUser[]> {
  const db = getPool();

  const res = await db.query<{
    name: string;
    email: string;
    created_at: Date;
    deleted_at: Date | null;
    household_name: string | null;
    plan_name: string | null;
  }>(
    `SELECT u.name, u.email, u.created_at, u.deleted_at,
            h.name AS household_name, p.name AS plan_name
     FROM "user" u
     LEFT JOIN membership m ON m.user_id = u.id
     LEFT JOIN household h ON h.id = m.household_id
     LEFT JOIN plan p ON h.plan_id = p.id
     WHERE u.is_anonymized = false
     ORDER BY u.created_at DESC
     LIMIT 20`
  );

  return res.rows.map((row) => ({
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
    householdName: row.household_name,
    planName: row.plan_name,
  }));
}
