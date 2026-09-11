import { query } from "../db/index.js";
import { GET_SUBJECTS, GET_SUBJECT_MASTERS, GET_SUBJECTS_WITH_TEACHER_DETAILS } from "../queries/subjectQueries.js";
export async function getSubjects(schoolId, classId) {
    const result = await query(GET_SUBJECTS, [schoolId, classId]);
    return result.rows;
}
export async function getSubjectMasters() {
    const result = await query(GET_SUBJECT_MASTERS, []);
    return result.rows;
}
export async function getSubjectsWithTeachers(schoolId, classId) {
    const result = await query(GET_SUBJECTS_WITH_TEACHER_DETAILS, [schoolId, classId]);
    return result.rows;
}
export async function updateSubjectTeacher(schoolId, classId, subjectMasterId, teacherId, sayId) {
    await query("DELETE FROM school_subject_teachers WHERE school_id = $1 AND class_id = $2 AND subject_id = $3", [schoolId, classId, subjectMasterId]);
    if (teacherId) {
        await query(`INSERT INTO school_subject_teachers (school_id, school_academic_year_id, subject_id, teacher_id, class_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`, [schoolId, sayId || null, subjectMasterId, teacherId, classId]);
    }
}
export async function syncClassSubjects(schoolId, classId, masterSubjectIds, sayId) {
    // 1. Fetch existing subject master IDs assigned to this class
    const existingRes = await query("SELECT subject_id FROM school_class_subjects WHERE school_id = $1 AND class_id = $2", [schoolId, classId]);
    const existingMasterIds = new Set(existingRes.rows.map(r => Number(r.subject_id)));
    const newMasterIds = new Set(masterSubjectIds);
    // 2. Remove subjects no longer selected
    for (const existingId of existingMasterIds) {
        if (!newMasterIds.has(existingId)) {
            await query("DELETE FROM school_class_subjects WHERE school_id = $1 AND class_id = $2 AND subject_id = $3", [schoolId, classId, existingId]);
            await query("DELETE FROM school_subject_teachers WHERE school_id = $1 AND class_id = $2 AND subject_id = $3", [schoolId, classId, existingId]);
        }
    }
    // 3. Insert newly selected subjects
    for (const masterId of masterSubjectIds) {
        if (!existingMasterIds.has(masterId)) {
            await query(`INSERT INTO school_class_subjects (school_id, school_academic_year_id, class_id, subject_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`, [schoolId, sayId || null, classId, masterId]);
        }
    }
    return getSubjects(schoolId, classId);
}
