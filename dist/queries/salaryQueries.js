export const GET_SALARIES = `
  SELECT 
    sr.id::text,
    sr.teacher_id::text AS "teacherId",
    u.name AS "teacherName",
    COALESCE(
      (SELECT string_agg(sub.name, ', ') FROM subjects sub WHERE sub.teacher_id = sr.teacher_id),
      'Mathematics'
    ) AS subject,
    sr.basic_salary::numeric::float AS "baseSalary",
    (sr.other_allowances)::numeric::float AS allowances,
    (sr.other_deductions)::numeric::float AS deductions,
    sr.gross_salary::numeric::float AS "grossSalary",
    sr.net_salary::numeric::float AS "netSalary",
    sr.month,
    sr.year,
    sr.status,
    ay.label AS "academicYear",
    sr.school_academic_year_id::text AS "schoolAcademicYearId",
    sr.paid_at::text AS "paidDate",
    sr.school_id::text AS "schoolId"
  FROM salary_records sr
  JOIN users u ON sr.teacher_id = u.id
  LEFT JOIN school_academic_years say ON sr.school_academic_year_id = say.id
  LEFT JOIN academic_years ay ON say.academic_year_id = ay.id
  WHERE ($1::int IS NULL OR sr.school_id = $1::int)
    AND ($2::text IS NULL OR ay.label = $2::text)
`;
export const GET_SALARY_BY_ID = `
  SELECT * FROM salary_records WHERE id = $1
`;
export const GET_FULL_SALARY_RECORD = `
  SELECT 
    sr.id::text,
    sr.teacher_id::text AS "teacherId",
    u.name AS "teacherName",
    COALESCE(
      (SELECT string_agg(sub.name, ', ') FROM subjects sub WHERE sub.teacher_id = sr.teacher_id),
      'Mathematics'
    ) AS subject,
    sr.basic_salary::numeric::float AS "baseSalary",
    (sr.other_allowances)::numeric::float AS allowances,
    (sr.other_deductions)::numeric::float AS deductions,
    sr.gross_salary::numeric::float AS "grossSalary",
    sr.net_salary::numeric::float AS "netSalary",
    sr.month,
    sr.year,
    sr.status,
    ay.label AS "academicYear",
    sr.school_academic_year_id::text AS "schoolAcademicYearId",
    sr.paid_at::text AS "paidDate",
    sr.school_id::text AS "schoolId"
  FROM salary_records sr
  JOIN users u ON sr.teacher_id = u.id
  LEFT JOIN school_academic_years say ON sr.school_academic_year_id = say.id
  LEFT JOIN academic_years ay ON say.academic_year_id = ay.id
  WHERE sr.id = $1
`;
export const CREATE_SALARY = `
  INSERT INTO salary_records (
     school_id, school_academic_year_id, teacher_id, month, year, basic_salary, other_allowances, other_deductions, 
     gross_salary, total_deductions, net_salary, status, paid_at
   ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
   RETURNING id
`;
export const UPDATE_SALARY = `
  UPDATE salary_records 
  SET basic_salary = $1, other_allowances = $2, other_deductions = $3, 
      gross_salary = $4, total_deductions = $5, net_salary = $6, 
      month = $7, year = $8, status = $9, paid_at = $10,
      school_academic_year_id = COALESCE($11, school_academic_year_id)
  WHERE id = $12
`;
export const DELETE_SALARY = `
  DELETE FROM salary_records WHERE id = $1
`;
