export const GET_SUBJECTS = `
  SELECT 
    s.id::text, 
    s.school_id::text AS "schoolId", 
    s.subject_master_id::text AS "subjectMasterId",
    sm.name AS "masterSubjectName",
    s.name, 
    s.code, 
    s.class_id::text AS "classId", 
    COALESCE(st.teacher_id, s.teacher_id)::text AS "teacherId",
    u.name AS "teacherName"
  FROM subjects s
  LEFT JOIN subject_masters sm ON s.subject_master_id = sm.id
  LEFT JOIN subject_teachers st ON st.subject_id = s.id AND st.class_id = s.class_id
  LEFT JOIN users u ON COALESCE(st.teacher_id, s.teacher_id) = u.id
  WHERE ($1::int IS NULL OR s.school_id = $1::int)
    AND ($2::int IS NULL OR s.class_id = $2::int)
  ORDER BY s.name ASC
`;

export const GET_SUBJECT_MASTERS = `
  SELECT id::text, name, code, category, description 
  FROM subject_masters 
  ORDER BY name ASC
`;

export const GET_SUBJECTS_WITH_TEACHER_DETAILS = `
  SELECT 
    s.id::text, 
    s.school_id::text AS "schoolId", 
    s.subject_master_id::text AS "subjectMasterId",
    sm.name AS "masterSubjectName",
    s.name, 
    s.code, 
    s.class_id::text AS "classId", 
    c.name AS "className",
    c.section AS "classSection",
    COALESCE(st.teacher_id, s.teacher_id)::text AS "teacherId",
    u.name AS "teacherName",
    u.email AS "teacherEmail"
  FROM subjects s
  LEFT JOIN subject_masters sm ON s.subject_master_id = sm.id
  LEFT JOIN classes c ON s.class_id = c.id
  LEFT JOIN subject_teachers st ON st.subject_id = s.id AND st.class_id = s.class_id
  LEFT JOIN users u ON COALESCE(st.teacher_id, s.teacher_id) = u.id
  WHERE ($1::int IS NULL OR s.school_id = $1::int)
    AND ($2::int IS NULL OR s.class_id = $2::int)
  ORDER BY c.name ASC, c.section ASC, s.name ASC
`;

export const UPDATE_SUBJECT_TEACHER = `
  UPDATE subjects 
  SET teacher_id = $1, updated_at = now() 
  WHERE id = $2 
  RETURNING id::text, name, code, class_id::text AS "classId", teacher_id::text AS "teacherId"
`;

export const GET_SUBJECT_TEACHERS = `
  SELECT 
    st.id::text,
    st.subject_id::text AS "subjectId",
    s.name AS "subjectName",
    st.teacher_id::text AS "teacherId",
    u.name AS "teacherName",
    st.class_id::text AS "classId",
    c.name AS "className",
    c.section AS "classSection"
  FROM subject_teachers st
  JOIN subjects s ON st.subject_id = s.id
  JOIN users u ON st.teacher_id = u.id
  LEFT JOIN classes c ON st.class_id = c.id
  WHERE ($1::int IS NULL OR s.school_id = $1::int)
`;

