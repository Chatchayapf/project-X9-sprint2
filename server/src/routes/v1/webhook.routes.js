import { Router } from "express";
import { handleStripeWebhook } from "../../controllers/webhook.controller.js";

const router = Router();

router.post("/", handleStripeWebhook);

export { router };
