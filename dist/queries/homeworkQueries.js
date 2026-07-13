export const GET_HOMEWORK = `
  SELECT 
    h.id::text,
    h.school_id::text AS "schoolId",
    h.class_id::text AS "classId",
    c.name AS "className",
    c.section AS "section",
    h.subject_id::text AS "subjectId",
    sub.name AS "subjectName",
    h.teacher_id::text AS "teacherId",
    u.name AS "teacherName",
    h.title,
    h.description,
    h.due_date::text AS "dueDate",
    h.created_at::text AS "createdAt"
  FROM homework h
  JOIN classes c ON h.class_id = c.id
  JOIN subjects sub ON h.subject_id = sub.id
  LEFT JOIN users u ON h.teacher_id = u.id
  WHERE ($1::int IS NULL OR h.school_id = $1::int)
    AND ($2::int IS NULL OR h.class_id = $2::int)
    AND ($3::int IS NULL OR h.teacher_id = $3::int)
  ORDER BY h.due_date ASC
`;
export const CREATE_HOMEWORK = `
  INSERT INTO homework (school_id, class_id, subject_id, teacher_id, title, description, due_date)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *
`;
export const UPDATE_HOMEWORK = `
  UPDATE homework 
  SET class_id = $1, subject_id = $2, title = $3, description = $4, due_date = $5
  WHERE id = $6
  RETURNING *
`;
export const DELETE_HOMEWORK = `
  DELETE FROM homework WHERE id = $1 RETURNING *
`;
