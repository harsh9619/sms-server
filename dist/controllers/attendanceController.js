import { toIntID } from "../db/index.js";
import * as attendanceService from "../services/attendanceService.js";
export async function getAttendance(req, res) {
    try {
        const schoolIdStr = req.params.schoolId;
        const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
        const academicYear = req.query.academicYear ? String(req.query.academicYear) : null;
        const attendance = await attendanceService.getAttendance(schoolId, academicYear);
        res.json(attendance);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
