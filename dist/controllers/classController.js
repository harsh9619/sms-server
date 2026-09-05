import { toIntID } from "../db/index.js";
import * as classService from "../services/classService.js";
export async function getClasses(req, res) {
    try {
        const schoolIdStr = req.params.schoolId;
        const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
        const academicYear = req.headers.academicyearid ? toIntID(String(req.headers.academicyearid)) : null;
        const classes = await classService.getClasses(schoolId, academicYear);
        res.json(classes);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function createClass(req, res) {
    try {
        const schoolIdStr = req.params.schoolId;
        const schoolId = toIntID(String(schoolIdStr));
        const { name, section, teacherId, subjects, academicYear } = req.body;
        if (!name || !section) {
            return res.status(400).json({ error: "Class name and section are required." });
        }
        const dbTeacherId = teacherId ? toIntID(String(teacherId)) : null;
        const newClassId = await classService.createClass(schoolId, {
            name,
            section,
            teacherId: dbTeacherId,
            subjects,
            academicYear: academicYear || null,
        });
        const fullRecord = await classService.getFullClassRecord(newClassId);
        res.status(201).json(fullRecord);
    }
    catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ error: "A class with this name and section already exists." });
        }
        res.status(500).json({ error: String(err) });
    }
}
export async function updateClass(req, res) {
    try {
        const classId = toIntID(req.params.id);
        const existing = await classService.getClassById(classId);
        if (!existing) {
            return res.status(404).json({ error: "Class not found" });
        }
        const schoolId = toIntID(existing.schoolId);
        const { name, section, teacherId, subjects, academicYear } = req.body;
        if (!name || !section) {
            return res.status(400).json({ error: "Class name and section are required." });
        }
        const dbTeacherId = teacherId ? toIntID(String(teacherId)) : null;
        const headerSayId = req.headers.academicyearid;
        await classService.updateClass(classId, schoolId, {
            name,
            section,
            teacherId: dbTeacherId,
            subjects,
            academicYear: academicYear || null,
            // classMasterId,
            // schoolAcademicYearId,
        }, headerSayId);
        const fullRecord = await classService.getFullClassRecord(classId);
        res.json(fullRecord);
    }
    catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ error: "A class with this name and section already exists." });
        }
        res.status(500).json({ error: String(err) });
    }
}
export async function deleteClass(req, res) {
    try {
        const classId = toIntID(req.params.id);
        const existing = await classService.getFullClassRecord(classId);
        if (!existing) {
            return res.status(404).json({ error: "Class not found" });
        }
        await classService.deleteClass(classId);
        res.json(existing);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function getClassMasters(_req, res) {
    try {
        const masters = await classService.getClassMasters();
        res.json(masters);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function createClassesBatch(req, res) {
    try {
        const schoolIdStr = req.params.schoolId;
        const schoolId = toIntID(String(schoolIdStr || "1"));
        const { classes } = req.body;
        if (!Array.isArray(classes) || classes.length === 0) {
            return res.status(400).json({ error: "An array of class items is required." });
        }
        const headerSayId = req.headers.academicyearid;
        const created = await classService.createClassesBatch(schoolId, classes, headerSayId);
        res.status(201).json(created);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
