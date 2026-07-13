import { query } from "../db/index.js";
import * as queries from "../queries/markQueries.js";

export async function getMarks(schoolId: number | null, studentId: number | null, subjectId: number | null, classId: number | null) {
  const result = await query(queries.GET_MARKS, [schoolId, studentId, subjectId, classId]);
  return result.rows;
}

export async function createOrUpdateMark(schoolId: number, data: any) {
  const { studentId, subjectId, examType, score, maxScore, examDate, enteredBy } = data;
  const result = await query(
    queries.CREATE_OR_UPDATE_MARK,
    [
      schoolId,
      studentId,
      subjectId,
      examType,
      score,
      maxScore || 100,
      examDate || new Date(),
      enteredBy || null
    ]
  );
  return result.rows[0];
}

export async function updateMark(markId: number, data: any) {
  const { score, maxScore, examDate } = data;
  const result = await query(
    queries.UPDATE_MARK,
    [score, maxScore, examDate, markId]
  );
  return result.rows[0] || null;
}

export async function deleteMark(markId: number) {
  const result = await query(queries.DELETE_MARK, [markId]);
  return result.rows[0] || null;
}
