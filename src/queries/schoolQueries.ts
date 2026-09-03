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
    COALESCE(ay.label, s.academic_year) AS "academicYear",
    say.id::text AS "schoolAcademicYearId",
    ay.id::text AS "academicYearId",
    s.created_at::text AS "createdAt",
    s.updated_at::text AS "updatedAt"
  FROM schools s
  LEFT JOIN school_academic_years say ON s.id = say.school_id AND say.is_current = TRUE
  LEFT JOIN academic_years ay ON say.academic_year_id = ay.id
  WHERE ($1::int IS NULL OR s.id = $1::int)
    AND ($2::text IS NULL OR s.name ILIKE '%' || $2 || '%' OR s.slug ILIKE '%' || $2 || '%' OR s.email ILIKE '%' || $2 || '%')
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
    COALESCE(ay.label, s.academic_year) AS "academicYear",
    say.id::text AS "schoolAcademicYearId",
    ay.id::text AS "academicYearId",
    s.created_at::text AS "createdAt",
    s.updated_at::text AS "updatedAt"
  FROM schools s
  LEFT JOIN school_academic_years say ON s.id = say.school_id AND say.is_current = TRUE
  LEFT JOIN academic_years ay ON say.academic_year_id = ay.id
  WHERE s.id = $1
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
  ORDER BY ay.label DESC
`;
