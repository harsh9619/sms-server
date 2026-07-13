import { toIntID } from "../db/index.js";
import * as feeService from "../services/feeService.js";
export async function getFees(req, res) {
    try {
        const schoolIdStr = req.headers["x-school-id"] || req.query.schoolId;
        const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
        const fees = await feeService.getFees(schoolId);
        res.json(fees);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function createFee(req, res) {
    try {
        const schoolIdStr = req.headers["x-school-id"] || req.query.schoolId || req.body.schoolId;
        const schoolId = toIntID(String(schoolIdStr));
        const { studentId, amount, feeType, dueDate, paidDate, status, remarks } = req.body;
        const dbStudentId = toIntID(String(studentId));
        const newFeeId = await feeService.createFee(schoolId, {
            studentId: dbStudentId,
            amount,
            feeType,
            dueDate,
            paidDate,
            status,
            remarks
        });
        const fullRecord = await feeService.getFullFeeRecord(newFeeId);
        res.status(201).json(fullRecord);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function updateFee(req, res) {
    try {
        const feeId = toIntID(req.params.id);
        const existing = await feeService.getFeeById(feeId);
        if (!existing) {
            return res.status(404).json({ error: "Fee record not found" });
        }
        const { amount, feeType, remarks, dueDate, status, paidDate } = req.body;
        await feeService.updateFee(feeId, {
            amount,
            feeType,
            remarks,
            dueDate,
            status,
            paidDate
        });
        const fullRecord = await feeService.getFullFeeRecord(feeId);
        res.json(fullRecord);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function deleteFee(req, res) {
    try {
        const feeId = toIntID(req.params.id);
        const existing = await feeService.getFullFeeRecord(feeId);
        if (!existing) {
            return res.status(404).json({ error: "Not found" });
        }
        await feeService.deleteFee(feeId);
        res.json(existing);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
