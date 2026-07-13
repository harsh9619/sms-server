export const GET_ATTENDANCE = `
  SELECT 
    a.id::text,
    a.student_id::text AS "studentId",
    u.name AS "studentName",
    s.roll_no AS "rollNumber",
    c.name AS class,
    c.section AS section,
    a.date::text AS date,
    a.status,
    ub.name AS "markedBy",
    a.created_at::text AS "markedAt",
    a.school_id::text AS "schoolId"
  FROM attendance a
  JOIN students s ON a.student_id = s.id
  JOIN users u ON s.user_id = u.id
  LEFT JOIN classes c ON a.class_id = c.id
  LEFT JOIN users ub ON a.marked_by = ub.id
  WHERE ($1::int IS NULL OR a.school_id = $1::int)
`;
