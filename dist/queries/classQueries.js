export const GET_CLASSES = `
  SELECT 
    c.id::text,
    c.name,
    c.section,
    c.teacher_id::text AS "teacherId",
    u.name AS "teacherName",
    (SELECT COUNT(*)::int FROM students s WHERE s.class_id = c.id) AS "studentCount",
    COALESCE(
      (SELECT json_agg(sub.name) FROM subjects sub WHERE sub.class_id = c.id),
      '[]'::json
    ) AS subjects,
    c.school_id::text AS "schoolId"
  FROM classes c
  LEFT JOIN users u ON c.teacher_id = u.id
  WHERE ($1::int IS NULL OR c.school_id = $1::int)
`;
export const GET_CLASS_BY_ID = `
  SELECT 
    c.id::text,
    c.name,
    c.section,
    c.school_id::text AS "schoolId",
    c.teacher_id::text AS "teacherId"
  FROM classes c
  WHERE c.id = $1
`;
export const GET_FULL_CLASS_RECORD = `
  SELECT 
    c.id::text,
    c.name,
    c.section,
    c.teacher_id::text AS "teacherId",
    u.name AS "teacherName",
    (SELECT COUNT(*)::int FROM students s WHERE s.class_id = c.id) AS "studentCount",
    COALESCE(
      (SELECT json_agg(sub.name) FROM subjects sub WHERE sub.class_id = c.id),
      '[]'::json
    ) AS subjects,
    c.school_id::text AS "schoolId"
  FROM classes c
  LEFT JOIN users u ON c.teacher_id = u.id
  WHERE c.id = $1
`;
export const CREATE_CLASS = `
  INSERT INTO classes (school_id, name, section, teacher_id, academic_year)
  VALUES ($1, $2, $3, $4, '2024-25')
  RETURNING *
`;
export const CREATE_SUBJECT = `
  INSERT INTO subjects (school_id, name, code, class_id, teacher_id)
  VALUES ($1, $2, $3, $4, $5)
`;
export const UPDATE_CLASS = `
  UPDATE classes 
  SET name = $1, section = $2, teacher_id = $3
  WHERE id = $4
`;
export const GET_SUBJECTS_FOR_CLASS = `
  SELECT id, name FROM subjects 
  WHERE class_id = $1
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
