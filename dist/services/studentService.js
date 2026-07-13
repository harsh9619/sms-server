import { query } from "../db/index.js";
import * as queries from "../queries/studentQueries.js";
export async function getStudents(schoolId) {
    const result = await query(queries.GET_STUDENTS, [schoolId]);
    return result.rows;
}
export async function checkEmailExists(email, schoolId, excludeUserId) {
    const q = excludeUserId ? queries.CHECK_EMAIL_EXISTS_WITH_EXCLUDE : queries.CHECK_EMAIL_EXISTS;
    const params = excludeUserId
        ? [email.toLowerCase(), schoolId, excludeUserId]
        : [email.toLowerCase(), schoolId];
    const res = await query(q, params);
    return res.rows.length > 0;
}
export async function getOrCreateClass(schoolId, className, section) {
    const classRes = await query(queries.GET_CLASS, [schoolId, className, section]);
    if (classRes.rows.length === 0) {
        const newClassRes = await query(queries.CREATE_CLASS, [schoolId, className, section]);
        return newClassRes.rows[0].id;
    }
    return classRes.rows[0].id;
}
export async function checkRollNumberExists(schoolId, classId, rollNumber, excludeStudentId) {
    const q = excludeStudentId ? queries.CHECK_ROLL_NUMBER_EXISTS_WITH_EXCLUDE : queries.CHECK_ROLL_NUMBER_EXISTS;
    const params = excludeStudentId
        ? [schoolId, classId, rollNumber, excludeStudentId]
        : [schoolId, classId, rollNumber];
    const res = await query(q, params);
    return res.rows.length > 0;
}
export async function createStudent(schoolId, data) {
    const { name, email, phone, classId, rollNumber, parentName, parentPhone, address, dateOfBirth, gender, bloodGroup } = data;
    await query("BEGIN");
    try {
        const userRes = await query(queries.CREATE_USER, [schoolId, name, email.toLowerCase(), "password123", phone || null]);
        const userId = userRes.rows[0].id;
        const dobValue = dateOfBirth ? dateOfBirth : null;
        const genderValue = ['male', 'female', 'other'].includes(gender) ? gender : 'other';
        const studentRes = await query(queries.CREATE_STUDENT, [
            schoolId,
            userId,
            classId,
            rollNumber,
            dobValue,
            genderValue,
            bloodGroup || null,
            address || null,
            parentName || null,
            parentPhone || null
        ]);
        const studentId = studentRes.rows[0].id;
        await query("COMMIT");
        return studentId;
    }
    catch (err) {
        await query("ROLLBACK").catch(() => { });
        throw err;
    }
}
export async function getStudentById(studentId) {
    const result = await query(queries.GET_STUDENT_BY_ID, [studentId]);
    return result.rows[0] || null;
}
export async function updateStudent(studentId, userId, classId, data) {
    const { name, email, phone, rollNumber, parentName, parentPhone, address, dateOfBirth, gender, bloodGroup } = data;
    await query("BEGIN");
    try {
        await query(queries.UPDATE_USER, [name, email.toLowerCase(), phone || null, userId]);
        const dobValue = dateOfBirth ? dateOfBirth : null;
        const genderValue = ['male', 'female', 'other'].includes(gender) ? gender : 'other';
        await query(queries.UPDATE_STUDENT, [
            classId,
            rollNumber,
            dobValue,
            genderValue,
            bloodGroup || null,
            address || null,
            parentName || null,
            parentPhone || null,
            studentId
        ]);
        await query("COMMIT");
    }
    catch (err) {
        await query("ROLLBACK").catch(() => { });
        throw err;
    }
}
export async function deleteStudent(userId) {
    await query(queries.DELETE_USER, [userId]);
}
