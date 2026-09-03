import { query } from "../db/index.js";
import { GET_SCHOOLS, GET_SCHOOL_BY_ID, GET_SCHOOL_ACADEMIC_YEARS } from "../queries/schoolQueries.js";
export async function getSchools(schoolId, search) {
    const result = await query(GET_SCHOOLS, [schoolId || null, search || null]);
    return result.rows;
}
export async function getSchoolById(id) {
    const result = await query(GET_SCHOOL_BY_ID, [id]);
    return result.rows[0] || null;
}
export async function getSchoolAcademicYears(schoolId) {
    const result = await query(GET_SCHOOL_ACADEMIC_YEARS, [schoolId]);
    return result.rows;
}
