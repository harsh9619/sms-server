import { query } from "../db/index.js";
import * as queries from "../queries/classQueries.js";

export async function getClasses(schoolId: number | null, academicYear?: string | null) {
  const result = await query(queries.GET_CLASSES, [schoolId, academicYear || null]);
  return result.rows;
}

export async function getClassById(classId: number) {
  const result = await query(queries.GET_CLASS_BY_ID, [classId]);
  return result.rows[0] || null;
}

export async function getFullClassRecord(classId: number) {
  const result = await query(queries.GET_FULL_CLASS_RECORD, [classId]);
  return result.rows[0] || null;
}

export async function createClass(schoolId: number, data: any) {
  const { name, section, teacherId, subjects, academicYear } = data;
  const dbTeacherId = teacherId ? teacherId : null;
  const dbAcademicYear = academicYear || '2024-25';

  await query("BEGIN");
  try {
    const classResult = await query(queries.CREATE_CLASS, [schoolId, name, section, dbTeacherId, dbAcademicYear]);
    const newClass = classResult.rows[0];

    if (subjects && Array.isArray(subjects)) {
      for (const sub of subjects) {
        const cleanSub = String(sub).trim();
        if (!cleanSub) continue;
        await query(queries.CREATE_SUBJECT, [schoolId, cleanSub, cleanSub.toUpperCase(), newClass.id, dbTeacherId]);
      }
    }

    await query("COMMIT");
    return newClass.id as number;
  } catch (err) {
    await query("ROLLBACK").catch(() => {});
    throw err;
  }
}

export async function updateClass(classId: number, schoolId: number, data: any) {
  const { name, section, teacherId, subjects, academicYear } = data;
  const dbTeacherId = teacherId ? teacherId : null;

  await query("BEGIN");
  try {
    await query(queries.UPDATE_CLASS, [name, section, dbTeacherId, academicYear || null, classId]);

    if (subjects && Array.isArray(subjects)) {
      const cleanSubjects = subjects.map((s: any) => String(s).trim()).filter(Boolean);
      
      const existingSubjectsRes = await query(queries.GET_SUBJECTS_FOR_CLASS, [classId]);
      const existingSubjects = existingSubjectsRes.rows;
      const existingNames = existingSubjects.map(s => s.name);

      const toDelete = existingSubjects.filter(s => !cleanSubjects.includes(s.name));
      for (const sub of toDelete) {
        await query(queries.DELETE_SUBJECT, [sub.id]);
      }

      const toAdd = cleanSubjects.filter(name => !existingNames.includes(name));
      for (const sub of toAdd) {
        await query(queries.CREATE_SUBJECT, [schoolId, sub, sub.toUpperCase(), classId, dbTeacherId]);
      }

      await query(queries.UPDATE_SUBJECTS_TEACHER, [dbTeacherId, classId]);
    }

    await query("COMMIT");
  } catch (err) {
    await query("ROLLBACK").catch(() => {});
    throw err;
  }
}

export async function deleteClass(classId: number) {
  await query(queries.DELETE_CLASS, [classId]);
}
