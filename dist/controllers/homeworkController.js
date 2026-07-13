import { toIntID } from "../db/index.js";
import * as homeworkService from "../services/homeworkService.js";
export async function getHomework(req, res) {
    try {
        const schoolIdStr = req.params.schoolId;
        const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
        const classIdStr = req.query.classId;
        const classId = classIdStr ? toIntID(String(classIdStr)) : null;
        const teacherIdStr = req.query.teacherId;
        const teacherId = teacherIdStr ? toIntID(String(teacherIdStr)) : null;
        const homework = await homeworkService.getHomework(schoolId, classId, teacherId);
        res.json(homework);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function createHomework(req, res) {
    try {
        const schoolIdStr = req.params.schoolId;
        const schoolId = toIntID(String(schoolIdStr));
        const { classId, subjectId, teacherId, title, description, dueDate } = req.body;
        const homework = await homeworkService.createHomework(schoolId, {
            classId: toIntID(classId),
            subjectId: toIntID(subjectId),
            teacherId: toIntID(teacherId),
            title,
            description,
            dueDate
        });
        res.status(201).json(homework);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function updateHomework(req, res) {
    try {
        const homeworkId = toIntID(req.params.id);
        const { classId, subjectId, title, description, dueDate } = req.body;
        const homework = await homeworkService.updateHomework(homeworkId, {
            classId: toIntID(classId),
            subjectId: toIntID(subjectId),
            title,
            description,
            dueDate
        });
        if (!homework) {
            return res.status(404).json({ error: "Homework not found" });
        }
        res.json(homework);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function deleteHomework(req, res) {
    try {
        const homeworkId = toIntID(req.params.id);
        const homework = await homeworkService.deleteHomework(homeworkId);
        if (!homework) {
            return res.status(404).json({ error: "Homework not found" });
        }
        res.json(homework);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
