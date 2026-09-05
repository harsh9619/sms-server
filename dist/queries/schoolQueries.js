export const GET_SCHOOLS = `
  SELECT 
    s.id::text, 
    s.name, 
    s.slug,
    s.address, 
    s.phone, 
    s.email, 
    s.board AS type, 
    s.logo_url AS "logoUrl",
    s.theme,
    s.appearance_mode AS "appearanceMode",
    s.is_active AS "isActive",
    s.subscription,
    s.max_students AS "maxStudents",
    COALESCE(
      (SELECT ay_curr.label 
       FROM school_academic_years say_curr 
       JOIN academic_years ay_curr ON say_curr.academic_year_id = ay_curr.id 
       WHERE say_curr.school_id = s.id AND say_curr.is_current = TRUE LIMIT 1),
      s.academic_year
    ) AS "academicYear",
    (
      SELECT say_curr.id::text 
      FROM school_academic_years say_curr 
      WHERE say_curr.school_id = s.id AND say_curr.is_current = TRUE LIMIT 1
    ) AS "schoolAcademicYearId",
    COALESCE(
      json_agg(
        json_build_object(
          'schoolAcademicYearId', say.id::text,
          'academicYearId', ay.id::text,
          'academicYear', ay.label,
          'isCurrent', say.is_current,
          'createdAt', say.created_at::text
        ) ORDER BY say.is_current DESC, ay.label DESC
      ) FILTER (WHERE say.id IS NOT NULL),
      '[]'::json
    ) AS "academicYears",
    s.created_at::text AS "createdAt",
    s.updated_at::text AS "updatedAt"
  FROM schools s
  LEFT JOIN school_academic_years say ON s.id = say.school_id
  LEFT JOIN academic_years ay ON say.academic_year_id = ay.id
  WHERE ($1::int IS NULL OR s.id = $1::int)
    AND ($2::text IS NULL OR s.name ILIKE '%' || $2 || '%' OR s.slug ILIKE '%' || $2 || '%' OR s.email ILIKE '%' || $2 || '%')
  GROUP BY s.id
  ORDER BY s.id ASC
`;
export const GET_SCHOOL_BY_ID = `
  SELECT 
    s.id::text, 
    s.name, 
    s.slug,
    s.address, 
    s.phone, 
    s.email, 
    s.board AS type, 
    s.logo_url AS "logoUrl",
    s.theme,
    s.appearance_mode AS "appearanceMode",
    s.is_active AS "isActive",
    s.subscription,
    s.max_students AS "maxStudents",
    COALESCE(
      (SELECT ay_curr.label 
       FROM school_academic_years say_curr 
       JOIN academic_years ay_curr ON say_curr.academic_year_id = ay_curr.id 
       WHERE say_curr.school_id = s.id AND say_curr.is_current = TRUE LIMIT 1),
      s.academic_year
    ) AS "academicYear",
    (
      SELECT say_curr.id::text 
      FROM school_academic_years say_curr 
      WHERE say_curr.school_id = s.id AND say_curr.is_current = TRUE LIMIT 1
    ) AS "schoolAcademicYearId",
    COALESCE(
      json_agg(
        json_build_object(
          'schoolAcademicYearId', say.id::text,
          'academicYearId', ay.id::text,
          'academicYear', ay.label,
          'isCurrent', say.is_current,
          'createdAt', say.created_at::text
        ) ORDER BY say.is_current DESC, ay.label DESC
      ) FILTER (WHERE say.id IS NOT NULL),
      '[]'::json
    ) AS "academicYears",
    s.created_at::text AS "createdAt",
    s.updated_at::text AS "updatedAt"
  FROM schools s
  LEFT JOIN school_academic_years say ON s.id = say.school_id
  LEFT JOIN academic_years ay ON say.academic_year_id = ay.id
  WHERE s.id = $1
  GROUP BY s.id
`;
export const CREATE_SCHOOL = `
  INSERT INTO schools (name, slug, address, phone, email, board, logo_url, is_active, subscription, max_students, academic_year, theme, appearance_mode)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  RETURNING id
`;
export const UPDATE_SCHOOL = `
  UPDATE schools
  SET name            = $1,
      slug            = $2,
      address         = $3,
      phone           = $4,
      email           = $5,
      board           = $6,
      logo_url        = $7,
      is_active       = $8,
      subscription    = $9,
      max_students    = $10,
      theme           = $11,
      appearance_mode = $12,
      updated_at      = now()
  WHERE id = $13
`;
export const GET_MASTER_THEMES = `
  SELECT id, name, label, color, sort_order
  FROM master_themes
  WHERE is_active = TRUE
  ORDER BY sort_order ASC
`;
export const DELETE_SCHOOL = `
  DELETE FROM schools WHERE id = $1
`;
export const GET_SCHOOL_ACADEMIC_YEARS = `
  SELECT 
    say.id::text AS "schoolAcademicYearId",
    say.school_id::text AS "schoolId",
    ay.id::text AS "academicYearId",
    ay.label AS "academicYear",
    say.is_current AS "isCurrent",
    say.created_at::text AS "createdAt"
  FROM school_academic_years say
  JOIN academic_years ay ON say.academic_year_id = ay.id
  WHERE say.school_id = $1
  ORDER BY say.is_current DESC, ay.label DESC
`;
