import { query } from "../db/index.js";
import * as queries from "../queries/userQueries.js";

export async function getUsers(schoolId: number | null, showAll: boolean) {
  let result;
  if (schoolId && !showAll) {
    result = await query(queries.GET_USERS_BY_SCHOOL, [schoolId]);
  } else {
    result = await query(queries.GET_ALL_USERS);
  }
  return result.rows;
}

export async function getUserById(userId: number) {
  const result = await query(queries.GET_USER_BY_ID, [userId]);
  return result.rows[0] || null;
}

export async function getFullUserRecord(userId: number) {
  const result = await query(queries.GET_FULL_USER_RECORD, [userId]);
  return result.rows[0] || null;
}

export async function createUser(data: any) {
  const { name, email, phone, dbRole, schoolId } = data;

  await query("BEGIN");
  try {
    const insertRes = await query(queries.CREATE_USER, [schoolId, name, email, "password123", dbRole, phone || null]);

    const userId = insertRes.rows[0].id;
    if (dbRole === "student") {
      await query(queries.CREATE_STUDENT, [schoolId, userId, "N/A", "other"]);
    }
    await query("COMMIT");
    return userId as number;
  } catch (err) {
    await query("ROLLBACK").catch(() => {});
    throw err;
  }
}

export async function updateUser(userId: number, data: any) {
  const { name, email, phone, dbRole, schoolId } = data;

  await query("BEGIN");
  try {
    await query(queries.UPDATE_USER, [name, email, phone || null, dbRole, schoolId, userId]);

    const studentRecord = await query(queries.GET_STUDENT, [userId]);
    if (dbRole === "student") {
      if (studentRecord.rows.length === 0) {
        await query(queries.CREATE_STUDENT, [schoolId, userId, "N/A", "other"]);
      } else {
        await query(queries.UPDATE_STUDENT_SCHOOL, [schoolId, userId]);
      }
    } else if (studentRecord.rows.length > 0) {
      await query(queries.DELETE_STUDENT, [userId]);
    }

    await query("COMMIT");
  } catch (err) {
    await query("ROLLBACK").catch(() => {});
    throw err;
  }
}

export async function deleteUser(userId: number) {
  await query(queries.DELETE_USER, [userId]);
}
