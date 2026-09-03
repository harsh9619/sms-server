import { query } from "../db/index.js";
import * as queries from "../queries/salaryQueries.js";
export async function getSalaries(schoolId, academicYear) {
    const result = await query(queries.GET_SALARIES, [schoolId, academicYear || null]);
    return result.rows;
}
export async function getSalaryById(recordId) {
    const result = await query(queries.GET_SALARY_BY_ID, [recordId]);
    return result.rows[0] || null;
}
export async function getFullSalaryRecord(recordId) {
    const result = await query(queries.GET_FULL_SALARY_RECORD, [recordId]);
    return result.rows[0] || null;
}
export async function createSalary(schoolId, data) {
    const { teacherId, baseSalary, allowances, deductions, month, year, status, paidDate } = data;
    const dbBaseSalary = baseSalary || 0;
    const dbAllowances = allowances || 0;
    const dbDeductions = deductions || 0;
    const grossSalary = dbBaseSalary + dbAllowances;
    const netSalary = grossSalary - dbDeductions;
    const validStatuses = ['pending', 'approved', 'paid', 'on_hold'];
    const dbStatus = validStatuses.includes(status) ? status : 'pending';
    const result = await query(queries.CREATE_SALARY, [
        schoolId,
        teacherId,
        month,
        year,
        dbBaseSalary,
        dbAllowances,
        dbDeductions,
        grossSalary,
        dbDeductions,
        netSalary,
        dbStatus,
        paidDate || null
    ]);
    return result.rows[0].id;
}
export async function updateSalary(recordId, data) {
    const { baseSalary, allowances, deductions, month, year, status, paidDate } = data;
    const grossSalary = baseSalary + allowances;
    const netSalary = grossSalary - deductions;
    const validStatuses = ['pending', 'approved', 'paid', 'on_hold'];
    const dbStatus = validStatuses.includes(status) ? status : 'pending';
    await query(queries.UPDATE_SALARY, [
        baseSalary,
        allowances,
        deductions,
        grossSalary,
        deductions,
        netSalary,
        month,
        year,
        dbStatus,
        paidDate || null,
        recordId
    ]);
}
export async function deleteSalary(recordId) {
    await query(queries.DELETE_SALARY, [recordId]);
}
