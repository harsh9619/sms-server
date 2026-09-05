import { query } from "../db/index.js";
import * as queries from "../queries/academicYearQueries.js";

export async function getSchoolAcademicYearId(
  schoolId: number,
  headerVal?: number | null
): Promise<number | null> {
  const parsedInt = headerVal ? parseInt(String(headerVal), 10) : null;
  const headerStr = headerVal ? String(headerVal).trim() : null;

  if (headerStr) {
    const res = await query(
      `SELECT say.id 
       FROM school_academic_years say
       LEFT JOIN academic_years ay ON say.academic_year_id = ay.id
       WHERE say.school_id = $1 
         AND (
           ($2::int IS NOT NULL AND (say.id = $2::int OR say.academic_year_id = $2::int))
           OR ay.label = $3::text
         )
       LIMIT 1`,
      [schoolId, parsedInt, headerStr]
    );
    if (res.rows.length > 0) {
      return Number(res.rows[0].id);
    }
  }

  // Fallback: query school_academic_years for active/latest entry for this school
  const fallbackRes = await query(
    `SELECT say.id 
     FROM school_academic_years say
     WHERE say.school_id = $1 
     ORDER BY say.is_current DESC, say.id DESC 
     LIMIT 1`,
    [schoolId]
  );
  return fallbackRes.rows[0]?.id ? Number(fallbackRes.rows[0].id) : null;
}

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
    await query("ROLLBACK").catch(() => { });
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
    await query("ROLLBACK").catch(() => { });
    throw err;
  }
}

export async function deleteAcademicYear(id: number) {
  await query(queries.DELETE_ACADEMIC_YEAR, [id]);
}
