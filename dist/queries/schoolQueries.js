export const GET_SCHOOLS = `
  SELECT 
    s.id::text, 
    s.name, 
    s.slug,
    s.address, 
    s.phone, 
    s.email, 
    s.board AS type, 
    s.logo_url AS theme,
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
    s.logo_url AS theme,
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
