export const GET_TEACHERS = `
  SELECT 
    u.id::text AS id,
    u.name,
    u.email,
    u.phone,
    COALESCE(
      (SELECT string_agg(sub.name, ', ') FROM subjects sub WHERE sub.teacher_id = u.id),
      'Mathematics'
    ) AS subject,
    'Science' AS department,
    'B.Ed' AS qualification,
    '5 years' AS experience,
    u.avatar_url AS avatar,
    u.created_at::text AS "joinDate",
    COALESCE(
      (SELECT basic_salary::numeric::float FROM salary_structures ss WHERE ss.teacher_id = u.id AND ss.is_active = TRUE LIMIT 1),
      50000
    ) AS salary,
    u.school_id::text AS "schoolId"
  FROM users u
  WHERE u.role = 'teacher'
    AND ($1::int IS NULL OR u.school_id = $1::int)
`;
