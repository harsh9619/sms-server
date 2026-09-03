export const GET_ACADEMIC_YEARS = `
  SELECT
    say.id::text,
    say.school_id::text AS "schoolId",
    ay.id::text AS "academicYearId",
    ay.label,
    say.is_current AS "isCurrent",
    say.created_at::text AS "createdAt"
  FROM school_academic_years say
  JOIN academic_years ay ON say.academic_year_id = ay.id
  WHERE ($1::int IS NULL OR say.school_id = $1::int)
  ORDER BY ay.label DESC
`;

export const GET_ACADEMIC_YEAR_BY_ID = `
  SELECT
    say.id::text,
    say.school_id::text AS "schoolId",
    ay.id::text AS "academicYearId",
    ay.label,
    say.is_current AS "isCurrent",
    say.created_at::text AS "createdAt"
  FROM school_academic_years say
  JOIN academic_years ay ON say.academic_year_id = ay.id
  WHERE say.id = $1
`;

export const GET_CURRENT_ACADEMIC_YEAR = `
  SELECT
    say.id::text,
    say.school_id::text AS "schoolId",
    ay.id::text AS "academicYearId",
    ay.label,
    say.is_current AS "isCurrent",
    say.created_at::text AS "createdAt"
  FROM school_academic_years say
  JOIN academic_years ay ON say.academic_year_id = ay.id
  WHERE say.school_id = $1 AND say.is_current = TRUE
  LIMIT 1
`;

export const CREATE_ACADEMIC_YEAR = `
  WITH new_ay AS (
    INSERT INTO academic_years (label)
    VALUES ($2)
    ON CONFLICT (label) DO UPDATE SET label = EXCLUDED.label
    RETURNING id
  )
  INSERT INTO school_academic_years (school_id, academic_year_id, is_current)
  VALUES ($1, (SELECT id FROM new_ay), $3)
  ON CONFLICT (school_id, academic_year_id) 
  DO UPDATE SET is_current = EXCLUDED.is_current
  RETURNING id::text, school_id::text AS "schoolId", is_current AS "isCurrent", created_at::text AS "createdAt"
`;

export const UPDATE_ACADEMIC_YEAR = `
  UPDATE school_academic_years
  SET is_current = $1, updated_at = now()
  WHERE id = $2
`;

export const SET_ALL_NON_CURRENT = `
  UPDATE school_academic_years
  SET is_current = FALSE
  WHERE school_id = $1
`;

export const DELETE_ACADEMIC_YEAR = `
  DELETE FROM school_academic_years WHERE id = $1
`;
