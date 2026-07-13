import { toIntID } from "../db/index.js";
import * as timetableService from "../services/timetableService.js";
export async function getTimetables(req, res) {
    try {
        const schoolIdStr = req.headers["x-school-id"] || req.query.schoolId;
        const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
        const classIdStr = req.query.classId;
        const classId = classIdStr ? toIntID(String(classIdStr)) : null;
        const teacherIdStr = req.query.teacherId;
        const teacherId = teacherIdStr ? toIntID(String(teacherIdStr)) : null;
        const timetables = await timetableService.getTimetables(schoolId, classId, teacherId);
        res.json(timetables);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function createTimetable(req, res) {
    try {
        const schoolIdStr = req.headers["x-school-id"] || req.query.schoolId || req.body.schoolId;
        const schoolId = toIntID(String(schoolIdStr));
        const { classId, subjectId, dayOfWeek, startTime, endTime, classroom } = req.body;
        const timetable = await timetableService.createTimetable(schoolId, {
            classId: toIntID(classId),
            subjectId: toIntID(subjectId),
            dayOfWeek,
            startTime,
            endTime,
            classroom
        });
        res.status(201).json(timetable);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function updateTimetable(req, res) {
    try {
        const timetableId = toIntID(req.params.id);
        const { classId, subjectId, dayOfWeek, startTime, endTime, classroom } = req.body;
        const timetable = await timetableService.updateTimetable(timetableId, {
            classId: toIntID(classId),
            subjectId: toIntID(subjectId),
            dayOfWeek,
            startTime,
            endTime,
            classroom
        });
        if (!timetable) {
            return res.status(404).json({ error: "Timetable slot not found" });
        }
        res.json(timetable);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function deleteTimetable(req, res) {
    try {
        const timetableId = toIntID(req.params.id);
        const timetable = await timetableService.deleteTimetable(timetableId);
        if (!timetable) {
            return res.status(404).json({ error: "Timetable slot not found" });
        }
        res.json(timetable);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
