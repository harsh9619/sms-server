import { query } from "../db/index.js";
import * as queries from "../queries/markQueries.js";
export async function getMarks(schoolId, studentId, subjectId, classId) {
    const result = await query(queries.GET_MARKS, [schoolId, studentId, subjectId, classId]);
    return result.rows;
}
export async function createOrUpdateMark(schoolId, data) {
    const { studentId, subjectId, examType, score, maxScore, examDate, enteredBy } = data;
    const result = await query(queries.CREATE_OR_UPDATE_MARK, [
        schoolId,
        studentId,
        subjectId,
        examType,
        score,
        maxScore || 100,
        examDate || new Date(),
        enteredBy || null
    ]);
    return result.rows[0];
}
export async function updateMark(markId, data) {
    const { score, maxScore, examDate } = data;
    const result = await query(queries.UPDATE_MARK, [score, maxScore, examDate, markId]);
    return result.rows[0] || null;
}
export async function deleteMark(markId) {
    const result = await query(queries.DELETE_MARK, [markId]);
    return result.rows[0] || null;
}
