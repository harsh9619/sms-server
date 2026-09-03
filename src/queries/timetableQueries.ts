export const GET_TIMETABLES = `
  SELECT 
    t.id::text,
    t.school_id::text AS "schoolId",
    t.class_id::text AS "classId",
    c.name AS "className",
    c.section AS "section",
    t.subject_id::text AS "subjectId",
    sub.name AS "subjectName",
    t.day_of_week AS "dayOfWeek",
    t.start_time::text AS "startTime",
    t.end_time::text AS "endTime",
    t.classroom,
    sub.teacher_id::text AS "teacherId",
    u.name AS "teacherName"
  FROM timetables t
  JOIN classes c ON t.class_id = c.id
  JOIN subjects sub ON t.subject_id = sub.id
  LEFT JOIN users u ON sub.teacher_id = u.id
  WHERE ($1::int IS NULL OR t.school_id = $1::int)
    AND ($2::int IS NULL OR t.class_id = $2::int)
    AND ($3::int IS NULL OR sub.teacher_id = $3::int)
  ORDER BY 
    CASE t.day_of_week
      WHEN 'monday' THEN 1
      WHEN 'tuesday' THEN 2
      WHEN 'wednesday' THEN 3
      WHEN 'thursday' THEN 4
      WHEN 'friday' THEN 5
      WHEN 'saturday' THEN 6
      ELSE 7
    END,
    t.start_time
`;

export const CREATE_TIMETABLE = `
  INSERT INTO timetables (school_id, school_academic_year_id, class_id, subject_id, day_of_week, start_time, end_time, classroom)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING *
`;

export const UPDATE_TIMETABLE = `
  UPDATE timetables 
  SET class_id = $1, subject_id = $2, day_of_week = $3, start_time = $4, end_time = $5, classroom = $6
  WHERE id = $7
  RETURNING *
`;

export const DELETE_TIMETABLE = `
  DELETE FROM timetables WHERE id = $1 RETURNING *
`;
