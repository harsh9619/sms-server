import { Request, Response } from "express";
import { toIntID } from "../db/index.js";
import * as teacherService from "../services/teacherService.js";

export async function getTeachers(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;

    const teachers = await teacherService.getTeachers(schoolId);
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
