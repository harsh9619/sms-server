import { query } from "../db/index.js";
import { GET_SUBJECTS } from "../queries/subjectQueries.js";

export async function getSubjects(schoolId: number | null, classId: number | null) {
  const result = await query(GET_SUBJECTS, [schoolId, classId]);
  return result.rows;
}
