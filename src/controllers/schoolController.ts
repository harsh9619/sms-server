import { Request, Response } from "express";
import * as schoolService from "../services/schoolService.js";

export async function getHealth(_req: Request, res: Response) {
  res.json({ status: "ok", time: new Date().toISOString() });
}

export async function getSchools(req: Request, res: Response) {
  try {
    const schoolId = req.query.schoolId ? Number(req.query.schoolId) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const schools = await schoolService.getSchools(schoolId, search);
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function getSchoolById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const school = await schoolService.getSchoolById(id);
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }
    res.json(school);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
