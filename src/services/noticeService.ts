import { query } from "../db/index.js";
import * as queries from "../queries/noticeQueries.js";

export async function getNotices(schoolId: number | null, audience: string | null) {
  const result = await query(queries.GET_NOTICES, [schoolId, audience]);
  return result.rows;
}

export async function createNotice(schoolId: number, data: any) {
  const { title, content, audience, isPinned, createdBy } = data;
  const result = await query(
    queries.CREATE_NOTICE,
    [schoolId, title, content, audience || 'all', isPinned || false, createdBy || null]
  );
  return result.rows[0];
}

export async function updateNotice(noticeId: number, data: any) {
  const { title, content, audience, isPinned } = data;
  const result = await query(
    queries.UPDATE_NOTICE,
    [title, content, audience, isPinned, noticeId]
  );
  return result.rows[0] || null;
}

export async function deleteNotice(noticeId: number) {
  const result = await query(queries.DELETE_NOTICE, [noticeId]);
  return result.rows[0] || null;
}
