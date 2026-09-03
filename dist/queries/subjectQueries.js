export const GET_SUBJECTS = `
  SELECT 
    s.id::text, 
    s.school_id::text AS "schoolId", 
    s.subject_master_id::text AS "subjectMasterId",
    sm.name AS "masterSubjectName",
    s.name, 
    s.code, 
    s.class_id::text AS "classId", 
    s.teacher_id::text AS "teacherId"
  FROM subjects s
  LEFT JOIN subject_masters sm ON s.subject_master_id = sm.id
  WHERE ($1::int IS NULL OR s.school_id = $1::int)
    AND ($2::int IS NULL OR s.class_id = $2::int)
`;
export const GET_SUBJECT_MASTERS = `
  SELECT id::text, name, code, category, description 
  FROM subject_masters 
  ORDER BY name ASC
`;
