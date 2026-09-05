import { query } from "../db/index.js";
import { 
  GET_SUBJECTS, 
  GET_SUBJECT_MASTERS, 
  GET_SUBJECTS_WITH_TEACHER_DETAILS, 
  UPDATE_SUBJECT_TEACHER 
} from "../queries/subjectQueries.js";

export async function getSubjects(schoolId: number | null, classId: number | null) {
  const result = await query(GET_SUBJECTS, [schoolId, classId]);
  return result.rows;
}

export async function getSubjectMasters() {
  const result = await query(GET_SUBJECT_MASTERS, []);
  return result.rows;
}

export async function getSubjectsWithTeachers(schoolId: number | null, classId: number | null) {
  const result = await query(GET_SUBJECTS_WITH_TEACHER_DETAILS, [schoolId, classId]);
  return result.rows;
}

export async function updateSubjectTeacher(subjectId: number, teacherId: number | null) {
  const result = await query(UPDATE_SUBJECT_TEACHER, [teacherId, subjectId]);
  return result.rows[0];
}

export async function syncClassSubjects(schoolId: number, classId: number, masterSubjectIds: number[]) {
  // 1. Get all subject_masters to look up names & codes
  const mastersRes = await query("SELECT id, name, code FROM subject_masters WHERE id = ANY($1::int[])", [masterSubjectIds]);
  const selectedMasters = mastersRes.rows;

  // 2. Fetch existing subjects assigned to this class
  const existingRes = await query("SELECT id, subject_master_id FROM subjects WHERE school_id = $1 AND class_id = $2", [schoolId, classId]);
  const existingSubjects = existingRes.rows;

  const existingMasterIds = new Set(existingSubjects.map(s => Number(s.subject_master_id)).filter(Boolean));
  const newMasterIds = new Set(masterSubjectIds);

  // 3. Remove subjects no longer selected
  for (const existing of existingSubjects) {
    const masterId = Number(existing.subject_master_id);
    if (masterId && !newMasterIds.has(masterId)) {
      await query("DELETE FROM class_subjects WHERE class_id = $1 AND subject_id = $2", [classId, existing.id]);
      await query("DELETE FROM subjects WHERE id = $1", [existing.id]);
    }
  }

  // 4. Insert newly selected subjects
  for (const master of selectedMasters) {
    if (!existingMasterIds.has(Number(master.id))) {
      const insRes = await query(
        `INSERT INTO subjects (school_id, class_id, subject_master_id, name, code)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [schoolId, classId, master.id, master.name, master.code]
      );
      const newSubjectId = insRes.rows[0]?.id;
      if (newSubjectId) {
        await query("INSERT INTO class_subjects (class_id, subject_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [classId, newSubjectId]);
      }
    }
  }

  // Return updated list of subjects for this class
  return getSubjects(schoolId, classId);
}
