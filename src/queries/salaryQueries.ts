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
    (sr.hra + sr.da + sr.ta + sr.medical + sr.other_allowances + sr.bonus)::numeric::float AS allowances,
    (sr.pf_deduction + sr.esi_deduction + sr.professional_tax + sr.tds + sr.other_deductions)::numeric::float AS deductions,
    sr.month,
    sr.year,
    sr.status,
    sr.paid_at::text AS "paidDate",
    sr.school_id::text AS "schoolId"
  FROM salary_records sr
  JOIN users u ON sr.teacher_id = u.id
  WHERE ($1::int IS NULL OR sr.school_id = $1::int)
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
    (sr.hra + sr.da + sr.ta + sr.medical + sr.other_allowances + sr.bonus)::numeric::float AS allowances,
    (sr.pf_deduction + sr.esi_deduction + sr.professional_tax + sr.tds + sr.other_deductions)::numeric::float AS deductions,
    sr.month,
    sr.year,
    sr.status,
    sr.paid_at::text AS "paidDate",
    sr.school_id::text AS "schoolId"
  FROM salary_records sr
  JOIN users u ON sr.teacher_id = u.id
  WHERE sr.id = $1
`;

export const CREATE_SALARY = `
  INSERT INTO salary_records (
     school_id, teacher_id, month, year, basic_salary, other_allowances, other_deductions, 
     gross_salary, total_deductions, net_salary, status, paid_at
   ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
   RETURNING id
`;

export const UPDATE_SALARY = `
  UPDATE salary_records 
  SET basic_salary = $1, other_allowances = $2, other_deductions = $3, 
      gross_salary = $4, total_deductions = $5, net_salary = $6, 
      month = $7, year = $8, status = $9, paid_at = $10
  WHERE id = $11
`;

export const DELETE_SALARY = `
  DELETE FROM salary_records WHERE id = $1
`;
