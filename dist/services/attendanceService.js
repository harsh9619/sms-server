import { query } from "../db/index.js";
import { GET_ATTENDANCE } from "../queries/attendanceQueries.js";
export async function getAttendance(schoolId, academicYear) {
    const result = await query(GET_ATTENDANCE, [schoolId, academicYear || null]);
    return result.rows;
}
