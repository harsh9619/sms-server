import * as schoolService from "../services/schoolService.js";
export async function getHealth(_req, res) {
    res.json({ status: "ok", time: new Date().toISOString() });
}
export async function getSchools(_req, res) {
    try {
        const schools = await schoolService.getSchools();
        res.json(schools);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
