export const GET_SCHOOLS = `
  SELECT 
    id::text, 
    name, 
    address, 
    phone, 
    email, 
    board AS type, 
    logo_url AS theme 
  FROM schools
`;
