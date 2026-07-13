import { query } from "../db/index.js";
import { GET_SCHOOLS } from "../queries/schoolQueries.js";

export async function getSchools() {
  const result = await query(GET_SCHOOLS);
  return result.rows;
}
