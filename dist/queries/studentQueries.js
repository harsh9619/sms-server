export const GET_STUDENTS = `
  SELECT 
    s.id::text,
    u.name,
    u.email,
    u.phone,
    c.name AS class,
    c.section AS section,
    s.roll_no AS "rollNumber",
    s.guardian_name AS "parentName",
    s.guardian_phone AS "parentPhone",
    s.address,
    s.dob::text AS "dateOfBirth",
    s.gender,
    u.avatar_url AS avatar,
    s.admission_date::text AS "admissionDate",
    s.blood_group AS "bloodGroup",
    s.school_id::text AS "schoolId"
  FROM students s
  JOIN users u ON s.user_id = u.id
  LEFT JOIN classes c ON s.class_id = c.id
  WHERE ($1::int IS NULL OR s.school_id = $1::int)
`;
export const CHECK_EMAIL_EXISTS_WITH_EXCLUDE = `
  SELECT id FROM users 
  WHERE email = $1 AND school_id = $2 AND id <> $3
`;
export const CHECK_EMAIL_EXISTS = `
  SELECT id FROM users 
  WHERE email = $1 AND school_id = $2
`;
export const GET_CLASS = `
  SELECT id FROM classes 
  WHERE school_id = $1 AND name = $2 AND section = $3
`;
export const CREATE_CLASS = `
  INSERT INTO classes (school_id, name, section, academic_year)
  VALUES ($1, $2, $3, '2024-25')
  RETURNING id
`;
export const CHECK_ROLL_NUMBER_EXISTS_WITH_EXCLUDE = `
  SELECT id FROM students 
  WHERE school_id = $1 AND class_id = $2 AND roll_no = $3 AND id <> $4
`;
export const CHECK_ROLL_NUMBER_EXISTS = `
  SELECT id FROM students 
  WHERE school_id = $1 AND class_id = $2 AND roll_no = $3
`;
export const CREATE_USER = `
  INSERT INTO users (school_id, name, email, password, role, phone)
  VALUES ($1, $2, $3, $4, 'student', $5)
  RETURNING id
`;
export const CREATE_STUDENT = `
  INSERT INTO students (school_id, user_id, class_id, roll_no, dob, gender, blood_group, address, guardian_name, guardian_phone)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING id
`;
export const GET_STUDENT_BY_ID = `
  SELECT 
    s.id::text,
    s.user_id,
    s.class_id,
    s.roll_no,
    s.school_id,
    u.name,
    u.email,
    u.phone,
    c.name AS class,
    c.section AS section,
    s.roll_no AS "rollNumber",
    s.guardian_name AS "parentName",
    s.guardian_phone AS "parentPhone",
    s.address,
    s.dob::text AS "dateOfBirth",
    s.gender,
    u.avatar_url AS avatar,
    s.admission_date::text AS "admissionDate",
    s.blood_group AS "bloodGroup",
    s.school_id::text AS "schoolId"
  FROM students s
  JOIN users u ON s.user_id = u.id
  LEFT JOIN classes c ON s.class_id = c.id
  WHERE s.id = $1
`;
export const UPDATE_USER = `
  UPDATE users
  SET name = $1, email = $2, phone = $3, updated_at = now()
  WHERE id = $4
`;
export const UPDATE_STUDENT = `
  UPDATE students
  SET class_id = $1,
      roll_no = $2,
      dob = $3,
      gender = $4,
      blood_group = $5,
      address = $6,
      guardian_name = $7,
      guardian_phone = $8,
      updated_at = now()
  WHERE id = $9
`;
export const DELETE_USER = `
  DELETE FROM users WHERE id = $1
`;
