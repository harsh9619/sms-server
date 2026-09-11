import { Request, Response } from "express";
import { toIntID } from "../db/index.js";
import * as subjectService from "../services/subjectService.js";

export async function getSubjects(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
    const classIdStr = req.query.classId;
    const classId = classIdStr ? toIntID(String(classIdStr)) : null;

    const subjects = await subjectService.getSubjects(schoolId, classId);
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function getSubjectMasters(_req: Request, res: Response) {
  try {
    const masters = await subjectService.getSubjectMasters();
    res.json(masters);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function getSubjectsWithTeachers(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
    const classIdStr = req.query.classId;
    const classId = classIdStr ? toIntID(String(classIdStr)) : null;

    const subjects = await subjectService.getSubjectsWithTeachers(schoolId, classId);
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function syncClassSubjects(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : 1;
    const { classId, masterSubjectIds } = req.body;

    if (!classId || !Array.isArray(masterSubjectIds)) {
      return res.status(400).json({ error: "classId and masterSubjectIds array are required" });
    }

    const updatedSubjects = await subjectService.syncClassSubjects(
      schoolId,
      toIntID(String(classId)),
      masterSubjectIds.map((id: any) => toIntID(String(id)))
    );

    res.json(updatedSubjects);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function assignSubjectTeacher(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : 1;
    const { subjectId, classId, teacherId } = req.body;
    if (!subjectId || !classId) {
      return res.status(400).json({ error: "subjectId and classId are required" });
    }

    await subjectService.updateSubjectTeacher(
      schoolId,
      toIntID(String(classId)),
      toIntID(String(subjectId)),
      teacherId ? toIntID(String(teacherId)) : null
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
