export const GET_FEES = `
  SELECT 
    f.id::text,
    f.student_id::text AS "studentId",
    u.name AS "studentName",
    s.roll_no AS "rollNumber",
    c.name AS class,
    c.section AS section,
    f.fee_type AS "feeType",
    f.amount::numeric::float AS amount,
    f.due_date::text AS "dueDate",
    f.paid_at::text AS "paidDate",
    f.status,
    COALESCE(f.description, '') AS remarks,
    f.school_id::text AS "schoolId"
  FROM fees f
  JOIN students s ON f.student_id = s.id
  JOIN users u ON s.user_id = u.id
  LEFT JOIN classes c ON s.class_id = c.id
  WHERE ($1::int IS NULL OR f.school_id = $1::int)
`;

export const GET_FEE_BY_ID = `
  SELECT * FROM fees WHERE id = $1
`;

export const GET_FULL_FEE_RECORD = `
  SELECT 
    f.id::text,
    f.student_id::text AS "studentId",
    u.name AS "studentName",
    s.roll_no AS "rollNumber",
    c.name AS class,
    c.section AS section,
    f.fee_type AS "feeType",
    f.amount::numeric::float AS amount,
    f.due_date::text AS "dueDate",
    f.paid_at::text AS "paidDate",
    f.status,
    COALESCE(f.description, '') AS remarks,
    f.school_id::text AS "schoolId"
  FROM fees f
  JOIN students s ON f.student_id = s.id
  JOIN users u ON s.user_id = u.id
  LEFT JOIN classes c ON s.class_id = c.id
  WHERE f.id = $1
`;

export const CREATE_FEE = `
  INSERT INTO fees (school_id, student_id, amount, fee_type, description, due_date, status, paid_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING id
`;

export const UPDATE_FEE = `
  UPDATE fees 
  SET amount = $1, fee_type = $2, description = $3, due_date = $4, status = $5, paid_at = $6
  WHERE id = $7
`;

export const DELETE_FEE = `
  DELETE FROM fees WHERE id = $1
`;
