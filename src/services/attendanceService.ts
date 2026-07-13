import { query } from "../db/index.js";
import { GET_ATTENDANCE } from "../queries/attendanceQueries.js";

export async function getAttendance(schoolId: number | null) {
  const result = await query(GET_ATTENDANCE, [schoolId]);
  return result.rows;
}
