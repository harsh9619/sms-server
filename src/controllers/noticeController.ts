import { Request, Response } from "express";
import { toIntID } from "../db/index.js";
import * as noticeService from "../services/noticeService.js";

export async function getNotices(req: Request, res: Response) {
  try {
    const schoolIdStr = req.headers["x-school-id"] || req.query.schoolId;
    const schoolId = schoolIdStr ? toIntID(String(schoolIdStr)) : null;
    const audience = req.query.audience ? String(req.query.audience) : null;

    const notices = await noticeService.getNotices(schoolId, audience);
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function createNotice(req: Request, res: Response) {
  try {
    const schoolIdStr = req.headers["x-school-id"] || req.query.schoolId || req.body.schoolId;
    const schoolId = toIntID(String(schoolIdStr));
    const { title, content, audience, isPinned, createdBy } = req.body;

    const notice = await noticeService.createNotice(schoolId, {
      title,
      content,
      audience,
      isPinned,
      createdBy: createdBy ? toIntID(createdBy) : null
    });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function updateNotice(req: Request, res: Response) {
  try {
    const noticeId = toIntID(req.params.id);
    const { title, content, audience, isPinned } = req.body;

    const notice = await noticeService.updateNotice(noticeId, {
      title,
      content,
      audience,
      isPinned
    });

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function deleteNotice(req: Request, res: Response) {
  try {
    const noticeId = toIntID(req.params.id);
    const notice = await noticeService.deleteNotice(noticeId);
    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
