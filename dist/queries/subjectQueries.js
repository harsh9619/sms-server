export const GET_SUBJECTS = `
  SELECT 
    sm.id::text, 
    scs.school_id::text AS "schoolId", 
    scs.school_academic_year_id::text AS "schoolAcademicYearId",
    sm.id::text AS "subjectMasterId",
    sm.name AS "masterSubjectName",
    sm.name, 
    sm.code, 
    scs.class_id::text AS "classId", 
    sst.teacher_id::text AS "teacherId",
    u.name AS "teacherName"
  FROM school_class_subjects scs
  JOIN subject_masters sm ON scs.subject_id = sm.id
  LEFT JOIN school_subject_teachers sst ON sst.subject_id = sm.id AND sst.class_id = scs.class_id
  LEFT JOIN users u ON sst.teacher_id = u.id
  WHERE ($1::int IS NULL OR scs.school_id = $1::int)
    AND ($2::int IS NULL OR scs.class_id = $2::int)
  ORDER BY sm.name ASC
`;
export const GET_SUBJECT_MASTERS = `
  SELECT id::text, name, code, category, description 
  FROM subject_masters 
  ORDER BY name ASC
`;
export const GET_SUBJECTS_WITH_TEACHER_DETAILS = `
  SELECT 
    sm.id::text, 
    scs.school_id::text AS "schoolId", 
    sm.id::text AS "subjectMasterId",
    sm.name AS "masterSubjectName",
    sm.name, 
    sm.code, 
    scs.class_id::text AS "classId", 
    c.name AS "className",
    c.section AS "classSection",
    sst.teacher_id::text AS "teacherId",
    u.name AS "teacherName",
    u.email AS "teacherEmail"
  FROM school_class_subjects scs
  JOIN subject_masters sm ON scs.subject_id = sm.id
  LEFT JOIN school_classes c ON scs.class_id = c.id
  LEFT JOIN school_subject_teachers sst ON sst.subject_id = sm.id AND sst.class_id = scs.class_id
  LEFT JOIN users u ON sst.teacher_id = u.id
  WHERE ($1::int IS NULL OR scs.school_id = $1::int)
    AND ($2::int IS NULL OR scs.class_id = $2::int)
  ORDER BY c.name ASC, c.section ASC, sm.name ASC
`;
export const UPDATE_SUBJECT_TEACHER = `
  INSERT INTO school_subject_teachers (school_id, school_academic_year_id, subject_id, teacher_id, class_id)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT DO NOTHING
  RETURNING id::text
`;
export const GET_SUBJECT_TEACHERS = `
  SELECT 
    sst.id::text,
    sst.subject_id::text AS "subjectId",
    sm.name AS "subjectName",
    sst.teacher_id::text AS "teacherId",
    u.name AS "teacherName",
    sst.class_id::text AS "classId",
    c.name AS "className",
    c.section AS "classSection"
  FROM school_subject_teachers sst
  JOIN subject_masters sm ON sst.subject_id = sm.id
  JOIN users u ON sst.teacher_id = u.id
  LEFT JOIN school_classes c ON sst.class_id = c.id
  WHERE ($1::int IS NULL OR sst.school_id = $1::int)
`;
