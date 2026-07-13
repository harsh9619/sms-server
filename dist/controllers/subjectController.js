import { toIntID } from "../db/index.js";
import * as subjectService from "../services/subjectService.js";
export async function getSubjects(req, res) {
    try {
        const schoolIdStr = req.headers["x-school-id"] || req.query.schoolId;
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
