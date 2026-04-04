import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Ticket Route with GET !");
});

export default router;