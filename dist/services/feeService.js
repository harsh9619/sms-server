import { query } from "../db/index.js";
import * as queries from "../queries/feeQueries.js";
export async function getFees(schoolId, academicYear) {
    const result = await query(queries.GET_FEES, [schoolId, academicYear || null]);
    return result.rows;
}
export async function getFeeById(feeId) {
    const result = await query(queries.GET_FEE_BY_ID, [feeId]);
    return result.rows[0] || null;
}
export async function getFullFeeRecord(feeId) {
    const result = await query(queries.GET_FULL_FEE_RECORD, [feeId]);
    return result.rows[0] || null;
}
export async function createFee(schoolId, data) {
    const { studentId, amount, feeType, dueDate, paidDate, status, remarks } = data;
    const validFeeTypes = ['tuition', 'exam', 'sports', 'library', 'transport', 'other'];
    const dbFeeType = validFeeTypes.includes(feeType) ? feeType : 'other';
    const description = remarks || (feeType !== dbFeeType ? feeType : null);
    const result = await query(queries.CREATE_FEE, [
        schoolId,
        studentId,
        amount,
        dbFeeType,
        description,
        dueDate || new Date(),
        status || 'pending',
        paidDate || null
    ]);
    return result.rows[0].id;
}
export async function updateFee(feeId, data) {
    const { amount, feeType, remarks, dueDate, status, paidDate } = data;
    const validFeeTypes = ['tuition', 'exam', 'sports', 'library', 'transport', 'other'];
    const dbFeeType = validFeeTypes.includes(feeType) ? feeType : 'other';
    const description = remarks || (feeType !== dbFeeType ? feeType : null);
    await query(queries.UPDATE_FEE, [amount, dbFeeType, description, dueDate, status, paidDate || null, feeId]);
}
export async function deleteFee(feeId) {
    await query(queries.DELETE_FEE, [feeId]);
}
