import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as authService from "../services/authService.js";

const jwtSecret = process.env.JWT_SECRET || "sms-jwt-secret";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = await authService.loginUser(String(email), String(password));

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    },
    jwtSecret,
    { expiresIn: "8h" }
  );

  res.json({ token, user });
}

export function me(req: Request, res: Response) {
  res.json({ user: req.user });
}
