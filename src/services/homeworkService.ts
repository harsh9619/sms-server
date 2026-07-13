import { query } from "../db/index.js";
import * as queries from "../queries/homeworkQueries.js";

export async function getHomework(schoolId: number | null, classId: number | null, teacherId: number | null) {
  const result = await query(queries.GET_HOMEWORK, [schoolId, classId, teacherId]);
  return result.rows;
}

export async function createHomework(schoolId: number, data: any) {
  const { classId, subjectId, teacherId, title, description, dueDate } = data;
  const result = await query(
    queries.CREATE_HOMEWORK,
    [schoolId, classId, subjectId, teacherId, title, description, dueDate]
  );
  return result.rows[0];
}

export async function updateHomework(homeworkId: number, data: any) {
  const { classId, subjectId, title, description, dueDate } = data;
  const result = await query(
    queries.UPDATE_HOMEWORK,
    [classId, subjectId, title, description, dueDate, homeworkId]
  );
  return result.rows[0] || null;
}

export async function deleteHomework(homeworkId: number) {
  const result = await query(queries.DELETE_HOMEWORK, [homeworkId]);
  return result.rows[0] || null;
}
