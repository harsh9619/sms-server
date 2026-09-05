import { toIntID } from "../db/index.js";
import * as subjectService from "../services/subjectService.js";
export async function getSubjects(req, res) {
    try {
        const schoolIdStr = req.params.schoolId;
        const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
        const classIdStr = req.query.classId;
        const classId = classIdStr ? toIntID(String(classIdStr)) : null;
        const subjects = await subjectService.getSubjects(schoolId, classId);
        res.json(subjects);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function getSubjectMasters(_req, res) {
    try {
        const masters = await subjectService.getSubjectMasters();
        res.json(masters);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function getSubjectsWithTeachers(req, res) {
    try {
        const schoolIdStr = req.params.schoolId;
        const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
        const classIdStr = req.query.classId;
        const classId = classIdStr ? toIntID(String(classIdStr)) : null;
        const subjects = await subjectService.getSubjectsWithTeachers(schoolId, classId);
        res.json(subjects);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function syncClassSubjects(req, res) {
    try {
        const schoolIdStr = req.params.schoolId;
        const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : 1;
        const { classId, masterSubjectIds } = req.body;
        if (!classId || !Array.isArray(masterSubjectIds)) {
            return res.status(400).json({ error: "classId and masterSubjectIds array are required" });
        }
        const updatedSubjects = await subjectService.syncClassSubjects(schoolId, toIntID(String(classId)), masterSubjectIds.map((id) => toIntID(String(id))));
        res.json(updatedSubjects);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function assignSubjectTeacher(req, res) {
    try {
        const { subjectId, teacherId } = req.body;
        if (!subjectId) {
            return res.status(400).json({ error: "subjectId is required" });
        }
        const updated = await subjectService.updateSubjectTeacher(toIntID(String(subjectId)), teacherId ? toIntID(String(teacherId)) : null);
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
