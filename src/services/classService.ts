import { query, toIntID } from "../db/index.js";
import * as queries from "../queries/classQueries.js";
import { getSchoolAcademicYearId } from "./academicYearService.js";

export { getSchoolAcademicYearId };

export async function resolveClassMasterId(
  className: string,
  explicitMasterId?: number | null
): Promise<number | null> {
  if (explicitMasterId) return explicitMasterId;
  if (!className) return null;

  const trimmedName = className.trim();
  const cmLabel = isNaN(Number(trimmedName)) ? trimmedName : `Class ${trimmedName}`;

  const res = await query(
    `SELECT id FROM class_masters WHERE LOWER(name) = LOWER($1) OR LOWER(name) = LOWER($2) LIMIT 1`,
    [cmLabel, trimmedName]
  );
  return res.rows[0]?.id ? Number(res.rows[0].id) : null;
}

export async function getClasses(
  schoolId: number | null,
  headerVal: number | null
) {
  let sayId: number | null = null;
  if (schoolId) {
    sayId = await getSchoolAcademicYearId(schoolId, headerVal);
  }


  const result = await query(queries.GET_CLASSES, [
    schoolId ?? null,
    // headerVal ?? null,
    sayId ?? null,
  ]);
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

export async function createClass(
  schoolId: number,
  data: any,
  headerVal?: string | number | null
) {
  const { name, section, teacherId, subjects, classMasterId, schoolAcademicYearId, academicYear } = data;
  const dbTeacherId = teacherId ? toIntID(String(teacherId)) : null;

  const finalSayId = await getSchoolAcademicYearId(
    schoolId,
    headerVal || schoolAcademicYearId || academicYear
  );
  const finalClassMasterId = await resolveClassMasterId(
    name,
    classMasterId ? toIntID(String(classMasterId)) : null
  );

  await query("BEGIN");
  try {
    const classResult = await query(queries.CREATE_CLASS, [
      schoolId,
      finalSayId,
      finalClassMasterId,
      name,
      section,
      dbTeacherId,
    ]);
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
    await query("ROLLBACK").catch(() => { });
    throw err;
  }
}

export async function updateClass(
  classId: number,
  schoolId: number,
  data: any,
  headerVal?: string | number | null,

) {
  const { name, section, teacherId, subjects, classMasterId, schoolAcademicYearId, academicYear } = data;
  const dbTeacherId = teacherId ? toIntID(String(teacherId)) : null;

  const finalSayId = await getSchoolAcademicYearId(
    schoolId,
    headerVal || schoolAcademicYearId || academicYear
  );
  const finalClassMasterId = await resolveClassMasterId(
    name,
    classMasterId ? toIntID(String(classMasterId)) : null
  );

  await query("BEGIN");
  try {
    await query(queries.UPDATE_CLASS, [name, section, dbTeacherId, finalSayId, finalClassMasterId, classId]);

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
    await query("ROLLBACK").catch(() => { });
    throw err;
  }
}

export async function deleteClass(classId: number) {
  await query(queries.DELETE_CLASS, [classId]);
}

export async function getClassMasters() {
  const result = await query(queries.GET_CLASS_MASTERS, []);
  return result.rows;
}

export async function createClassesBatch(
  schoolId: number,
  items: { name: string; section: string; teacherId?: number | null; classMasterId?: number | null }[],
  headerVal?: number | null
) {
  const createdClasses: any[] = [];
  const finalSayId = await getSchoolAcademicYearId(schoolId, headerVal);

  await query("BEGIN");
  try {
    for (const item of items) {
      const { name, section, teacherId, classMasterId } = item;
      const dbTeacherId = teacherId ? toIntID(String(teacherId)) : null;
      const finalClassMasterId = await resolveClassMasterId(
        name,
        classMasterId ? toIntID(String(classMasterId)) : null
      );

      const existingRes = await query(
        `SELECT id::text, name, section, school_academic_year_id::text AS "schoolAcademicYearId", class_master_id::text AS "classMasterId"
         FROM classes 
         WHERE school_id = $1 AND name = $2 AND section = $3 AND ($4::int IS NULL OR school_academic_year_id = $4::int)`,
        [schoolId, name, section, finalSayId]
      );
      if (existingRes.rows.length > 0) {
        createdClasses.push(existingRes.rows[0]);
        continue;
      }

      const classResult = await query(
        `INSERT INTO classes (school_id, school_academic_year_id, class_master_id, name, section, teacher_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id::text, name, section, school_academic_year_id::text AS "schoolAcademicYearId", class_master_id::text AS "classMasterId"`,
        [schoolId, finalSayId, finalClassMasterId, name, section, dbTeacherId]
      );

      if (classResult.rows.length > 0) {
        createdClasses.push(classResult.rows[0]);
      }
    }
    await query("COMMIT");
    return createdClasses;
  } catch (err) {
    await query("ROLLBACK").catch(() => { });
    throw err;
  }
}
