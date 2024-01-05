import { Router } from "express";
import { getDesks } from "../controllers/desks.controllers";

const router = Router();
router.get("/", getDesks);
export default router;
