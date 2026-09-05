export const GET_CLASSES = `
  SELECT 
    c.id::text,
    c.name,
    c.section,
    ay.label AS "academicYear",
    c.school_academic_year_id::text AS "schoolAcademicYearId",
    c.class_master_id::text AS "classMasterId",
    cm.name AS "classMasterName",
    cm.grade_level AS "gradeLevel",
    c.teacher_id::text AS "teacherId",
    u.name AS "teacherName",
    (SELECT COUNT(*)::int FROM students s WHERE s.class_id = c.id) AS "studentCount",
    COALESCE(
      (SELECT json_agg(sub.name) FROM subjects sub WHERE sub.class_id = c.id),
      '[]'::json
    ) AS subjects,
    c.school_id::text AS "schoolId"
  FROM classes c
  LEFT JOIN school_academic_years say ON c.school_academic_year_id = say.id
  LEFT JOIN academic_years ay ON say.academic_year_id = ay.id
  LEFT JOIN class_masters cm ON c.class_master_id = cm.id
  LEFT JOIN users u ON c.teacher_id = u.id
  WHERE ($1::int IS NULL OR c.school_id = $1::int)
    AND ($2::int IS NULL OR ay.id = $2::int)
    AND ($3::int IS NULL OR c.school_academic_year_id = $3::int)
  ORDER BY cm.grade_level ASC NULLS LAST, c.name ASC, c.section ASC
`;
export const GET_CLASS_BY_ID = `
  SELECT 
    c.id::text,
    c.name,
    c.section,
    c.school_id::text AS "schoolId",
    c.school_academic_year_id::text AS "schoolAcademicYearId",
    c.class_master_id::text AS "classMasterId",
    c.teacher_id::text AS "teacherId"
  FROM classes c
  WHERE c.id = $1
`;
export const GET_FULL_CLASS_RECORD = `
  SELECT 
    c.id::text,
    c.name,
    c.section,
    ay.label AS "academicYear",
    c.school_academic_year_id::text AS "schoolAcademicYearId",
    c.class_master_id::text AS "classMasterId",
    cm.name AS "classMasterName",
    cm.grade_level AS "gradeLevel",
    c.teacher_id::text AS "teacherId",
    u.name AS "teacherName",
    (SELECT COUNT(*)::int FROM students s WHERE s.class_id = c.id) AS "studentCount",
    COALESCE(
      (SELECT json_agg(sub.name) FROM subjects sub WHERE sub.class_id = c.id),
      '[]'::json
    ) AS subjects,
    c.school_id::text AS "schoolId"
  FROM classes c
  LEFT JOIN school_academic_years say ON c.school_academic_year_id = say.id
  LEFT JOIN academic_years ay ON say.academic_year_id = ay.id
  LEFT JOIN class_masters cm ON c.class_master_id = cm.id
  LEFT JOIN users u ON c.teacher_id = u.id
  WHERE c.id = $1
`;
export const CREATE_CLASS = `
  INSERT INTO classes (school_id, school_academic_year_id, class_master_id, name, section, teacher_id)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *
`;
export const CREATE_SUBJECT = `
  INSERT INTO subjects (school_id, subject_master_id, name, code, class_id, teacher_id)
  VALUES ($1, $2, $3, $4, $5, $6)
`;
export const UPDATE_CLASS = `
  UPDATE classes 
  SET name = $1, section = $2, teacher_id = $3, 
      school_academic_year_id = COALESCE($4, school_academic_year_id), 
      class_master_id = COALESCE($5, class_master_id)
  WHERE id = $6
`;
export const GET_SUBJECTS_FOR_CLASS = `
  SELECT s.id::text, s.name, s.code, s.subject_master_id::text AS "subjectMasterId", sm.name AS "masterSubjectName" 
  FROM subjects s
  LEFT JOIN subject_masters sm ON s.subject_master_id = sm.id
  WHERE s.class_id = $1
`;
export const DELETE_SUBJECT = `
  DELETE FROM subjects WHERE id = $1
`;
export const UPDATE_SUBJECTS_TEACHER = `
  UPDATE subjects SET teacher_id = $1 WHERE class_id = $2
`;
export const DELETE_CLASS = `
  DELETE FROM classes WHERE id = $1
`;
export const GET_CLASS_MASTERS = `
  SELECT id::text, name, grade_level AS "gradeLevel", description 
  FROM class_masters 
  ORDER BY grade_level ASC
`;
