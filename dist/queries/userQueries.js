export const GET_USERS_BY_SCHOOL = `
  SELECT 
    u.id::text,
    u.name,
    u.email,
    CASE 
      WHEN u.role = 'super_admin' THEN 'admin'
      WHEN u.role = 'school_admin' THEN 'admin'
      ELSE u.role
    END AS role,
    u.phone,
    u.avatar_url AS avatar,
    u.created_at::text AS "joinDate",
    CASE WHEN u.school_id IS NULL THEN ARRAY[]::text[] ELSE ARRAY[u.school_id::text] END AS "schoolIds"
  FROM users u
  WHERE u.school_id = $1 OR u.school_id IS NULL
`;
export const GET_ALL_USERS = `
  SELECT 
    u.id::text,
    u.name,
    u.email,
    CASE 
      WHEN u.role = 'super_admin' THEN 'admin'
      WHEN u.role = 'school_admin' THEN 'admin'
      ELSE u.role
    END AS role,
    u.phone,
    u.avatar_url AS avatar,
    u.created_at::text AS "joinDate",
    CASE WHEN u.school_id IS NULL THEN ARRAY[]::text[] ELSE ARRAY[u.school_id::text] END AS "schoolIds"
  FROM users u
`;
export const GET_USER_BY_ID = `
  SELECT * FROM users WHERE id = $1
`;
export const GET_FULL_USER_RECORD = `
  SELECT
    u.id::text,
    u.name,
    u.email,
    CASE
      WHEN u.role = 'super_admin' THEN 'admin'
      WHEN u.role = 'school_admin' THEN 'admin'
      ELSE u.role
    END AS role,
    u.phone,
    u.avatar_url AS avatar,
    u.created_at::text AS "joinDate",
    CASE WHEN u.school_id IS NULL THEN ARRAY[]::text[] ELSE ARRAY[u.school_id::text] END AS "schoolIds"
  FROM users u
  WHERE u.id = $1
`;
export const CREATE_USER = `
  INSERT INTO users (school_id, name, email, password, role, phone)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING id
`;
export const CREATE_STUDENT = `
  INSERT INTO students (school_id, user_id, roll_no, gender, admission_date)
  VALUES ($1, $2, $3, $4, CURRENT_DATE)
`;
export const UPDATE_USER = `
  UPDATE users
  SET name = $1,
      email = $2,
      phone = $3,
      role = $4,
      school_id = $5,
      updated_at = now()
  WHERE id = $6
`;
export const GET_STUDENT = `
  SELECT id FROM students WHERE user_id = $1
`;
export const UPDATE_STUDENT_SCHOOL = `
  UPDATE students SET school_id = $1 WHERE user_id = $2
`;
export const DELETE_STUDENT = `
  DELETE FROM students WHERE user_id = $1
`;
export const DELETE_USER = `
  DELETE FROM users WHERE id = $1
`;
