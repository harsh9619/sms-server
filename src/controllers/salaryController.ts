import { Request, Response } from "express";
import { toIntID } from "../db/index.js";
import * as salaryService from "../services/salaryService.js";

export async function getSalaries(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
    const academicYear = req.query.academicYear ? String(req.query.academicYear) : null;

    const salaries = await salaryService.getSalaries(schoolId, academicYear);
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function createSalary(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = toIntID(String(schoolIdStr));
    const { teacherId, baseSalary, allowances, deductions, month, year, status, paidDate } = req.body;

    const dbTeacherId = toIntID(String(teacherId));

    const newSalaryId = await salaryService.createSalary(schoolId, {
      teacherId: dbTeacherId,
      baseSalary,
      allowances,
      deductions,
      month,
      year,
      status,
      paidDate
    });

    const fullRecord = await salaryService.getFullSalaryRecord(newSalaryId);
    res.status(201).json(fullRecord);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function updateSalary(req: Request, res: Response) {
  try {
    const recordId = toIntID(req.params.id);
    const existing = await salaryService.getSalaryById(recordId);
    if (!existing) {
      return res.status(404).json({ error: "Salary record not found" });
    }

    const baseSalary = req.body.baseSalary !== undefined ? req.body.baseSalary : Number(existing.basic_salary);
    const allowances = req.body.allowances !== undefined ? req.body.allowances : Number(existing.other_allowances);
    const deductions = req.body.deductions !== undefined ? req.body.deductions : Number(existing.other_deductions);
    const month = req.body.month !== undefined ? req.body.month : existing.month;
    const year = req.body.year !== undefined ? req.body.year : existing.year;
    const status = req.body.status !== undefined ? req.body.status : existing.status;
    const paidDate = req.body.paidDate !== undefined ? req.body.paidDate : existing.paid_at;

    await salaryService.updateSalary(recordId, {
      baseSalary,
      allowances,
      deductions,
      month,
      year,
      status,
      paidDate
    });

    const fullRecord = await salaryService.getFullSalaryRecord(recordId);
    res.json(fullRecord);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function deleteSalary(req: Request, res: Response) {
  try {
    const recordId = toIntID(req.params.id);
    const existing = await salaryService.getFullSalaryRecord(recordId);
    if (!existing) {
      return res.status(404).json({ error: "Not found" });
    }

    await salaryService.deleteSalary(recordId);
    res.json(existing);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
