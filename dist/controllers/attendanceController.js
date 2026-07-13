import { toIntID } from "../db/index.js";
import * as attendanceService from "../services/attendanceService.js";
export async function getAttendance(req, res) {
    try {
        const schoolIdStr = req.headers["x-school-id"] || req.query.schoolId;
        const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
        const attendance = await attendanceService.getAttendance(schoolId);
        res.json(attendance);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
