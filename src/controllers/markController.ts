import { Request, Response } from "express";
import { toIntID } from "../db/index.js";
import * as markService from "../services/markService.js";

export async function getMarks(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
    const studentIdStr = req.query.studentId;
    const studentId = studentIdStr ? toIntID(String(studentIdStr)) : null;
    const subjectIdStr = req.query.subjectId;
    const subjectId = subjectIdStr ? toIntID(String(subjectIdStr)) : null;
    const classIdStr = req.query.classId;
    const classId = classIdStr ? toIntID(String(classIdStr)) : null;
    const academicYear = req.query.academicYear ? String(req.query.academicYear) : null;

    const marks = await markService.getMarks(schoolId, studentId, subjectId, classId, academicYear);
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function createOrUpdateMark(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = toIntID(String(schoolIdStr));
    const { studentId, subjectId, examType, score, maxScore, examDate, enteredBy } = req.body;

    const mark = await markService.createOrUpdateMark(schoolId, {
      studentId: toIntID(studentId),
      subjectId: toIntID(subjectId),
      examType,
      score,
      maxScore,
      examDate,
      enteredBy: enteredBy ? toIntID(enteredBy) : null
    });
    res.status(201).json(mark);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function updateMark(req: Request, res: Response) {
  try {
    const markId = toIntID(req.params.id);
    const { score, maxScore, examDate } = req.body;

    const mark = await markService.updateMark(markId, {
      score,
      maxScore,
      examDate
    });

    if (!mark) {
      return res.status(404).json({ error: "Marks record not found" });
    }
    res.json(mark);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function deleteMark(req: Request, res: Response) {
  try {
    const markId = toIntID(req.params.id);
    const mark = await markService.deleteMark(markId);
    if (!mark) {
      return res.status(404).json({ error: "Marks record not found" });
    }
    res.json(mark);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
