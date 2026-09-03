import { Request, Response } from "express";
import { toIntID } from "../db/index.js";
import * as academicYearService from "../services/academicYearService.js";

export async function getAcademicYears(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;

    const years = await academicYearService.getAcademicYears(schoolId);
    res.json(years);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function getCurrentAcademicYear(req: Request, res: Response) {
  try {
    const schoolId = toIntID(String(req.params.schoolId));
    const year = await academicYearService.getCurrentAcademicYear(schoolId);

    if (!year) {
      return res.status(404).json({ error: "No current academic year set for this school." });
    }

    res.json(year);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function createAcademicYear(req: Request, res: Response) {
  try {
    const schoolId = toIntID(String(req.params.schoolId));
    const { label, startDate, endDate, isCurrent } = req.body;

    if (!label || !startDate || !endDate) {
      return res.status(400).json({ error: "label, startDate, and endDate are required." });
    }

    const created = await academicYearService.createAcademicYear(schoolId, {
      label,
      startDate,
      endDate,
      isCurrent: !!isCurrent,
    });

    res.status(201).json(created);
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "An academic year with this label already exists for this school." });
    }
    res.status(500).json({ error: String(err) });
  }
}

export async function updateAcademicYear(req: Request, res: Response) {
  try {
    const id = toIntID(req.params.id);
    const existing = await academicYearService.getAcademicYearById(id);
    if (!existing) {
      return res.status(404).json({ error: "Academic year not found." });
    }
    const schoolId = toIntID(existing.schoolId);

    const { label, startDate, endDate, isCurrent } = req.body;
    if (!label || !startDate || !endDate) {
      return res.status(400).json({ error: "label, startDate, and endDate are required." });
    }

    await academicYearService.updateAcademicYear(id, schoolId, {
      label,
      startDate,
      endDate,
      isCurrent: !!isCurrent,
    });

    const updated = await academicYearService.getAcademicYearById(id);
    res.json(updated);
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "An academic year with this label already exists for this school." });
    }
    res.status(500).json({ error: String(err) });
  }
}

export async function deleteAcademicYear(req: Request, res: Response) {
  try {
    const id = toIntID(req.params.id);
    const existing = await academicYearService.getAcademicYearById(id);
    if (!existing) {
      return res.status(404).json({ error: "Academic year not found." });
    }

    await academicYearService.deleteAcademicYear(id);
    res.json(existing);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
