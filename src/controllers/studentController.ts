import { Request, Response } from "express";
import { toIntID } from "../db/index.js";
import * as studentService from "../services/studentService.js";

export async function getStudents(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
    const academicYear = req.query.academicYear ? String(req.query.academicYear) : null;

    const students = await studentService.getStudents(schoolId, academicYear);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function createStudent(req: Request, res: Response) {
  try {
    const schoolIdStr = req.params.schoolId;
    const schoolId = toIntID(String(schoolIdStr));

    const {
      name,
      email,
      phone,
      class: className,
      section,
      rollNumber,
      parentName,
      parentPhone,
      address,
      dateOfBirth,
      gender,
      bloodGroup
    } = req.body;

    if (!name || !email || !rollNumber || !className || !section) {
      return res.status(400).json({ error: "Name, email, roll number, class, and section are required." });
    }

    const emailExists = await studentService.checkEmailExists(email, schoolId);
    if (emailExists) {
      return res.status(400).json({ error: "A user with this email already exists in this school." });
    }

    const classId = await studentService.getOrCreateClass(schoolId, className, section);

    const rollExists = await studentService.checkRollNumberExists(schoolId, classId, rollNumber);
    if (rollExists) {
      return res.status(400).json({ error: `Roll number ${rollNumber} already exists in Class ${className}-${section}.` });
    }

    const studentId = await studentService.createStudent(schoolId, {
      name,
      email,
      phone,
      classId,
      rollNumber,
      parentName,
      parentPhone,
      address,
      dateOfBirth,
      gender,
      bloodGroup
    });

    const fullRecord = await studentService.getStudentById(studentId);
    res.status(201).json(fullRecord);
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Duplicate email or duplicate class roll number exists." });
    }
    res.status(500).json({ error: String(err) });
  }
}

export async function updateStudent(req: Request, res: Response) {
  try {
    const studentId = toIntID(req.params.id);
    const existing = await studentService.getStudentById(studentId);
    if (!existing) {
      return res.status(404).json({ error: "Student not found" });
    }
    const schoolId = existing.school_id;
    const userId = existing.user_id;

    const {
      name,
      email,
      phone,
      class: className,
      section,
      rollNumber,
      parentName,
      parentPhone,
      address,
      dateOfBirth,
      gender,
      bloodGroup
    } = req.body;

    if (!name || !email || !rollNumber || !className || !section) {
      return res.status(400).json({ error: "Name, email, roll number, class, and section are required." });
    }

    const classId = await studentService.getOrCreateClass(schoolId, className, section);

    if (existing.email.toLowerCase() !== email.toLowerCase()) {
      const emailExists = await studentService.checkEmailExists(email, schoolId, userId);
      if (emailExists) {
        return res.status(400).json({ error: "A user with this email already exists in this school." });
      }
    }

    if (existing.class_id !== classId || existing.roll_no !== rollNumber) {
      const rollExists = await studentService.checkRollNumberExists(schoolId, classId, rollNumber, studentId);
      if (rollExists) {
        return res.status(400).json({ error: `Roll number ${rollNumber} already exists in Class ${className}-${section}.` });
      }
    }

    await studentService.updateStudent(studentId, userId, classId, {
      name,
      email,
      phone,
      rollNumber,
      parentName,
      parentPhone,
      address,
      dateOfBirth,
      gender,
      bloodGroup
    });

    const fullRecord = await studentService.getStudentById(studentId);
    res.json(fullRecord);
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Duplicate email or duplicate class roll number exists." });
    }
    res.status(500).json({ error: String(err) });
  }
}

export async function deleteStudent(req: Request, res: Response) {
  try {
    const studentId = toIntID(req.params.id);
    const existing = await studentService.getStudentById(studentId);
    if (!existing) {
      return res.status(404).json({ error: "Student not found" });
    }
    const userId = existing.user_id;

    await studentService.deleteStudent(userId);
    res.json(existing);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
