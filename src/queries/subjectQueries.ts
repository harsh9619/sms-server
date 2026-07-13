export const GET_SUBJECTS = `
  SELECT id::text, school_id::text AS "schoolId", name, code, class_id::text AS "classId", teacher_id::text AS "teacherId"
  FROM subjects
  WHERE ($1::int IS NULL OR school_id = $1::int)
    AND ($2::int IS NULL OR class_id = $2::int)
`;
