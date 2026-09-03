import * as schoolService from "../services/schoolService.js";
export async function getHealth(_req, res) {
    res.json({ status: "ok", time: new Date().toISOString() });
}
export async function getSchools(req, res) {
    try {
        const schoolId = req.query.schoolId ? Number(req.query.schoolId) : undefined;
        const search = req.query.search ? String(req.query.search) : undefined;
        const schools = await schoolService.getSchools(schoolId, search);
        res.json(schools);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function getSchoolById(req, res) {
    try {
        const id = Number(req.params.id);
        const school = await schoolService.getSchoolById(id);
        if (!school) {
            return res.status(404).json({ error: "School not found" });
        }
        res.json(school);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
