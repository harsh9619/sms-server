import { query } from "../db/index.js";
import * as queries from "../queries/academicYearQueries.js";

export async function getAcademicYears(schoolId: number | null) {
  const result = await query(queries.GET_ACADEMIC_YEARS, [schoolId]);
  return result.rows;
}

export async function getAcademicYearById(id: number) {
  const result = await query(queries.GET_ACADEMIC_YEAR_BY_ID, [id]);
  return result.rows[0] || null;
}

export async function getCurrentAcademicYear(schoolId: number) {
  const result = await query(queries.GET_CURRENT_ACADEMIC_YEAR, [schoolId]);
  return result.rows[0] || null;
}

export async function createAcademicYear(schoolId: number, data: any) {
  const { label, startDate, endDate, isCurrent = false } = data;

  await query("BEGIN");
  try {
    // If setting as current, unset all others first
    if (isCurrent) {
      await query(queries.SET_ALL_NON_CURRENT, [schoolId]);
    }

    const result = await query(queries.CREATE_ACADEMIC_YEAR, [
      schoolId,
      label,
      startDate,
      endDate,
      isCurrent,
    ]);

    await query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await query("ROLLBACK").catch(() => {});
    throw err;
  }
}

export async function updateAcademicYear(id: number, schoolId: number, data: any) {
  const { label, startDate, endDate, isCurrent = false } = data;

  await query("BEGIN");
  try {
    // If setting as current, unset all others first
    if (isCurrent) {
      await query(queries.SET_ALL_NON_CURRENT, [schoolId]);
    }

    await query(queries.UPDATE_ACADEMIC_YEAR, [label, startDate, endDate, isCurrent, id]);

    await query("COMMIT");
  } catch (err) {
    await query("ROLLBACK").catch(() => {});
    throw err;
  }
}

export async function deleteAcademicYear(id: number) {
  await query(queries.DELETE_ACADEMIC_YEAR, [id]);
}
