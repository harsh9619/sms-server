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
      (SELECT json_agg(sm.name) FROM school_class_subjects scs JOIN subject_masters sm ON scs.subject_id = sm.id WHERE scs.class_id = c.id),
      '[]'::json
    ) AS subjects,
    c.school_id::text AS "schoolId"
  FROM school_classes c
  LEFT JOIN school_academic_years say ON c.school_academic_year_id = say.id
  LEFT JOIN academic_years ay ON say.academic_year_id = ay.id
  LEFT JOIN class_masters cm ON c.class_master_id = cm.id
  LEFT JOIN users u ON c.teacher_id = u.id
  WHERE ($1::int IS NULL OR c.school_id = $1::int)
    AND ($2::int IS NULL OR c.school_academic_year_id = $2::int)
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
  FROM school_classes c
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
      (SELECT json_agg(sm.name) FROM school_class_subjects scs JOIN subject_masters sm ON scs.subject_id = sm.id WHERE scs.class_id = c.id),
      '[]'::json
    ) AS subjects,
    c.school_id::text AS "schoolId"
  FROM school_classes c
  LEFT JOIN school_academic_years say ON c.school_academic_year_id = say.id
  LEFT JOIN academic_years ay ON say.academic_year_id = ay.id
  LEFT JOIN class_masters cm ON c.class_master_id = cm.id
  LEFT JOIN users u ON c.teacher_id = u.id
  WHERE c.id = $1
`;
export const CREATE_CLASS = `
  INSERT INTO school_classes (school_id, school_academic_year_id, class_master_id, name, section, teacher_id)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *
`;
export const CREATE_SUBJECT = `
  INSERT INTO school_class_subjects (school_id, school_academic_year_id, class_id, subject_id)
  VALUES ($1, $2, $3, $4)
`;
export const UPDATE_CLASS = `
  UPDATE school_classes 
  SET name = $1, section = $2, teacher_id = $3, 
      school_academic_year_id = COALESCE($4, school_academic_year_id), 
      class_master_id = COALESCE($5, class_master_id)
  WHERE id = $6
`;
export const GET_SUBJECTS_FOR_CLASS = `
  SELECT sm.id::text, sm.name, sm.code, sm.id::text AS "subjectMasterId", sm.name AS "masterSubjectName" 
  FROM school_class_subjects scs
  JOIN subject_masters sm ON scs.subject_id = sm.id
  WHERE scs.class_id = $1
`;
export const DELETE_SUBJECT = `
  DELETE FROM school_class_subjects WHERE class_id = $1 AND subject_id = $2
`;
export const UPDATE_SUBJECTS_TEACHER = `
  INSERT INTO school_subject_teachers (school_id, school_academic_year_id, subject_id, teacher_id, class_id)
  VALUES ($1, $2, $3, $4, $5)
`;
export const DELETE_CLASS = `
  DELETE FROM school_classes WHERE id = $1
`;
export const GET_CLASS_MASTERS = `
  SELECT id::text, name, grade_level AS "gradeLevel", description 
  FROM class_masters 
  ORDER BY grade_level ASC
`;
