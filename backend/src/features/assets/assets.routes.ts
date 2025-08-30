import express from "express";
import { createDistributionHub, createPipeline, createPlant, createStorage, DeleteDistributionHub, DeletePipeline, DeletePlant, DeleteStorage, getAllProjectsByDeveloper, updateDistributionHub, updatePipeline, updatePlant, updateStorage } from "./assets.controllers";
const router = express.Router();
router.post('/upload-data/distribution-hub', createDistributionHub);
router.patch('/distribution-hubs/:id', updateDistributionHub);
router.delete('/delete-distribution/:id', DeleteDistributionHub);
router.post('/upload-data/storage', createStorage);
router.patch('/storage/:id', updateStorage);
router.delete('/delete-storage/:id',DeleteStorage)
router.post('/upload-data/plants', createPlant);
router.patch('/plants/:id', updatePlant);
router.delete('/delete-plants/:id',DeletePlant)
router.post('/upload-data/pipelines', createPipeline);
router.patch('/pipelines/:id', updatePipeline);
router.delete('/delete-pipeline/:id',DeletePipeline)
router.get('/get-all-projects-developer/:project_developer_id', getAllProjectsByDeveloper);
export default router;