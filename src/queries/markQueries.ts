export const GET_MARKS = `
  SELECT 
    m.id::text,
    m.school_id::text AS "schoolId",
    m.school_academic_year_id::text AS "schoolAcademicYearId",
    ay.label AS "academicYear",
    m.student_id::text AS "studentId",
    u.name AS "studentName",
    s.roll_no AS "rollNumber",
    c.name AS class,
    c.section AS section,
    m.subject_id::text AS "subjectId",
    sub.name AS "subjectName",
    m.exam_type AS "examType",
    m.score::numeric::float AS score,
    m.max_score::numeric::float AS "maxScore",
    m.exam_date::text AS "examDate",
    m.created_at::text AS "createdAt"
  FROM marks m
  JOIN students s ON m.student_id = s.id
  JOIN users u ON s.user_id = u.id
  JOIN subjects sub ON m.subject_id = sub.id
  LEFT JOIN classes c ON s.class_id = c.id
  LEFT JOIN school_academic_years say ON m.school_academic_year_id = say.id
  LEFT JOIN academic_years ay ON say.academic_year_id = ay.id
  WHERE ($1::int IS NULL OR m.school_id = $1::int)
    AND ($2::int IS NULL OR m.student_id = $2::int)
    AND ($3::int IS NULL OR m.subject_id = $3::int)
    AND ($4::int IS NULL OR s.class_id = $4::int)
    AND ($5::text IS NULL OR ay.label = $5::text)
  ORDER BY m.exam_date DESC, sub.name ASC
`;

export const CREATE_OR_UPDATE_MARK = `
  INSERT INTO marks (school_id, school_academic_year_id, student_id, subject_id, exam_type, score, max_score, exam_date)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  ON CONFLICT (student_id, subject_id, exam_type, exam_date) 
  DO UPDATE SET score = EXCLUDED.score, max_score = EXCLUDED.max_score
  RETURNING *
`;

export const UPDATE_MARK = `
  UPDATE marks 
  SET score = $1, max_score = $2, exam_date = $3
  WHERE id = $4
  RETURNING *
`;

export const DELETE_MARK = `
  DELETE FROM marks WHERE id = $1 RETURNING *
`;
