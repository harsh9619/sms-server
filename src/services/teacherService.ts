import { query } from "../db/index.js";
import { GET_TEACHERS } from "../queries/teacherQueries.js";

export async function getTeachers(schoolId: number | null) {
  const result = await query(GET_TEACHERS, [schoolId]);
  return result.rows;
}
