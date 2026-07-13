import { toIntID } from "../db/index.js";
import * as userService from "../services/userService.js";
export async function getUsers(req, res) {
    try {
        const schoolIdStr = req.headers["x-school-id"] || req.query.schoolId;
        const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
        const showAll = req.query.all === "true";
        const users = await userService.getUsers(schoolId, showAll);
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
export async function createUser(req, res) {
    try {
        const { name, email, phone, role, schoolId } = req.body;
        if (!name || !email || !role) {
            return res.status(400).json({ error: "Name, email, and role are required." });
        }
        const dbRole = role === "admin"
            ? "school_admin"
            : role === "teacher"
                ? "teacher"
                : role === "student"
                    ? "student"
                    : "teacher";
        const schoolInt = schoolId ? toIntID(String(schoolId)) : null;
        if (dbRole !== "super_admin" && !schoolInt) {
            return res.status(400).json({ error: "School assignment is required for this role." });
        }
        const userId = await userService.createUser({
            name,
            email,
            phone,
            dbRole,
            schoolId: schoolInt
        });
        const fullRecord = await userService.getFullUserRecord(userId);
        res.status(201).json(fullRecord);
    }
    catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ error: "A user with this email already exists." });
        }
        res.status(500).json({ error: String(err) });
    }
}
export async function updateUser(req, res) {
    try {
        const userId = toIntID(req.params.id);
        const existing = await userService.getUserById(userId);
        if (!existing) {
            return res.status(404).json({ error: "User not found" });
        }
        const { name, email, phone, role, schoolId } = req.body;
        if (!name || !email || !role) {
            return res.status(400).json({ error: "Name, email, and role are required." });
        }
        const dbRole = role === "admin"
            ? "school_admin"
            : role === "teacher"
                ? "teacher"
                : role === "student"
                    ? "student"
                    : "teacher";
        const schoolInt = schoolId ? toIntID(String(schoolId)) : null;
        if (dbRole !== "super_admin" && !schoolInt) {
            return res.status(400).json({ error: "School assignment is required for this role." });
        }
        await userService.updateUser(userId, {
            name,
            email,
            phone,
            dbRole,
            schoolId: schoolInt
        });
        const fullRecord = await userService.getFullUserRecord(userId);
        res.json(fullRecord);
    }
    catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ error: "A user with this email already exists." });
        }
        res.status(500).json({ error: String(err) });
    }
}
export async function deleteUser(req, res) {
    try {
        const userId = toIntID(req.params.id);
        const existing = await userService.getFullUserRecord(userId);
        if (!existing) {
            return res.status(404).json({ error: "User not found" });
        }
        await userService.deleteUser(userId);
        res.json(existing);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
}
