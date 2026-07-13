export const GET_NOTICES = `
  SELECT 
    n.id::text,
    n.school_id::text AS "schoolId",
    n.title,
    n.content,
    n.audience,
    n.is_pinned AS "isPinned",
    n.created_by::text AS "createdBy",
    u.name AS "creatorName",
    n.created_at::text AS "createdAt"
  FROM notices n
  LEFT JOIN users u ON n.created_by = u.id
  WHERE ($1::int IS NULL OR n.school_id = $1::int)
    AND ($2::text IS NULL OR n.audience = $2::text OR n.audience = 'all')
  ORDER BY n.is_pinned DESC, n.created_at DESC
`;
export const CREATE_NOTICE = `
  INSERT INTO notices (school_id, title, content, audience, is_pinned, created_by)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *
`;
export const UPDATE_NOTICE = `
  UPDATE notices 
  SET title = $1, content = $2, audience = $3, is_pinned = $4
  WHERE id = $5
  RETURNING *
`;
export const DELETE_NOTICE = `
  DELETE FROM notices WHERE id = $1 RETURNING *
`;
