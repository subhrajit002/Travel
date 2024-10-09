import express from "express"
import { getDestinationById, searchDestinations } from "../controller/destinationController";

const router = express.Router();

router.get("/", searchDestinations)
router.get("/id/:id", getDestinationById)

export default router;