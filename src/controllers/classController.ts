import { Request, Response } from "express";
import { toIntID } from "../db/index.js";
import * as classService from "../services/classService.js";

export async function getClasses(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;

    const classes = await classService.getClasses(schoolId);
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function createClass(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = toIntID(String(schoolIdStr));
    const { name, section, teacherId, subjects } = req.body;

    if (!name || !section) {
      return res.status(400).json({ error: "Class name and section are required." });
    }

    const dbTeacherId = teacherId ? toIntID(String(teacherId)) : null;

    const newClassId = await classService.createClass(schoolId, {
      name,
      section,
      teacherId: dbTeacherId,
      subjects
    });

    const fullRecord = await classService.getFullClassRecord(newClassId);
    res.status(201).json(fullRecord);
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "A class with this name and section already exists." });
    }
    res.status(500).json({ error: String(err) });
  }
}

export async function updateClass(req: Request, res: Response) {
  try {
    const classId = toIntID(req.params.id);
    const existing = await classService.getClassById(classId);
    if (!existing) {
      return res.status(404).json({ error: "Class not found" });
    }
    const schoolId = toIntID(existing.schoolId);

    const { name, section, teacherId, subjects } = req.body;
    if (!name || !section) {
      return res.status(400).json({ error: "Class name and section are required." });
    }

    const dbTeacherId = teacherId ? toIntID(String(teacherId)) : null;

    await classService.updateClass(classId, schoolId, {
      name,
      section,
      teacherId: dbTeacherId,
      subjects
    });

    const fullRecord = await classService.getFullClassRecord(classId);
    res.json(fullRecord);
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "A class with this name and section already exists." });
    }
    res.status(500).json({ error: String(err) });
  }
}

export async function deleteClass(req: Request, res: Response) {
  try {
    const classId = toIntID(req.params.id);
    const existing = await classService.getFullClassRecord(classId);
    if (!existing) {
      return res.status(404).json({ error: "Class not found" });
    }

    await classService.deleteClass(classId);
    res.json(existing);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
