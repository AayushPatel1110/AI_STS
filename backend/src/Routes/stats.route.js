import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("stats Route with GET !");
});

export default router;