import { query } from "../db/index.js";
import { GET_SCHOOLS, GET_SCHOOL_BY_ID, GET_SCHOOL_ACADEMIC_YEARS, CREATE_SCHOOL, UPDATE_SCHOOL, DELETE_SCHOOL, GET_MASTER_THEMES, } from "../queries/schoolQueries.js";
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
export async function getMasterThemes() {
    const result = await query(GET_MASTER_THEMES, []);
    return result.rows;
}
export async function createSchool(data) {
    const result = await query(CREATE_SCHOOL, [
        data.name,
        data.slug,
        data.address || null,
        data.phone || null,
        data.email || null,
        data.board || null,
        data.logoUrl || null,
        data.isActive ?? true,
        data.subscription || null,
        data.maxStudents || null,
        data.academicYear || null,
        data.theme || "default",
        data.appearanceMode || "light",
    ]);
    return result.rows[0].id;
}
export async function updateSchool(id, data) {
    await query(UPDATE_SCHOOL, [
        data.name,
        data.slug,
        data.address || null,
        data.phone || null,
        data.email || null,
        data.board || null,
        data.logoUrl || null,
        data.isActive ?? true,
        data.subscription || null,
        data.maxStudents || null,
        data.theme || "default",
        data.appearanceMode || "light",
        id,
    ]);
}
export async function deleteSchool(id) {
    await query(DELETE_SCHOOL, [id]);
}
