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
export async function createSchool(req, res) {
    try {
        const { name, slug, address, phone, email, board, logoUrl, isActive, subscription, maxStudents, academicYear, theme, appearanceMode } = req.body;
        if (!name || !slug) {
            return res.status(400).json({ error: "Name and slug are required." });
        }
        const id = await schoolService.createSchool({
            name,
            slug,
            address,
            phone,
            email,
            board,
            logoUrl,
            isActive,
            subscription,
            maxStudents,
            academicYear,
            theme: theme || "default",
            appearanceMode: appearanceMode || "light",
        });
        const school = await schoolService.getSchoolById(id);
        res.status(201).json(school);
    }
    catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ error: "A school with this slug or email already exists." });
        }
        res.status(500).json({ error: String(err) });
    }
}
export async function updateSchool(req, res) {
    try {
        const id = Number(req.params.id);
        const existing = await schoolService.getSchoolById(id);
        if (!existing) {
            return res.status(404).json({ error: "School not found" });
        }
        const { name, slug, address, phone, email, board, logoUrl, isActive, subscription, maxStudents, theme, appearanceMode } = req.body;
        if (!name || !slug) {
            return res.status(400).json({ error: "Name and slug are required." });
        }
        await schoolService.updateSchool(id, {
            name,
            slug,
            address,
            phone,
            email,
            board,
            logoUrl,
            isActive,
            subscription,
            maxStudents,
            theme,
            appearanceMode,
        });
        const updated = await schoolService.getSchoolById(id);
        res.json(updated);
    }
    catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ error: "A school with this slug or email already exists." });
        }
        res.status(500).json({ error: String(err) });
    }
}
export async function getMasterThemes(_req, res) {
    try {
        const themes = await schoolService.getMasterThemes();
        res.json(themes);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function deleteSchool(req, res) {
    try {
        const id = Number(req.params.id);
        const existing = await schoolService.getSchoolById(id);
        if (!existing) {
            return res.status(404).json({ error: "School not found" });
        }
        await schoolService.deleteSchool(id);
        res.json(existing);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
