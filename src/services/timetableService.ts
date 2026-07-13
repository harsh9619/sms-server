import { query } from "../db/index.js";
import * as queries from "../queries/timetableQueries.js";

export async function getTimetables(schoolId: number | null, classId: number | null, teacherId: number | null) {
  const result = await query(queries.GET_TIMETABLES, [schoolId, classId, teacherId]);
  return result.rows;
}

export async function createTimetable(schoolId: number, data: any) {
  const { classId, subjectId, dayOfWeek, startTime, endTime, classroom } = data;
  const result = await query(
    queries.CREATE_TIMETABLE,
    [schoolId, classId, subjectId, dayOfWeek.toLowerCase(), startTime, endTime, classroom]
  );
  return result.rows[0];
}

export async function updateTimetable(timetableId: number, data: any) {
  const { classId, subjectId, dayOfWeek, startTime, endTime, classroom } = data;
  const result = await query(
    queries.UPDATE_TIMETABLE,
    [classId, subjectId, dayOfWeek.toLowerCase(), startTime, endTime, classroom, timetableId]
  );
  return result.rows[0] || null;
}

export async function deleteTimetable(timetableId: number) {
  const result = await query(queries.DELETE_TIMETABLE, [timetableId]);
  return result.rows[0] || null;
}
