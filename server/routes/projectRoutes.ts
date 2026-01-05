import express from 'express';

import { protect } from '../middleware/auth.js';
import { deleteproject, getProjectById, getProjectPreview, getPublishedProjects, makeRevisions, rollbackToVersion, saveProjectCode } from '../controllers/projectController.js';
const projectRouter = express.Router();
projectRouter.post('/revision/',protect, makeRevisions );
projectRouter.put('/save/:projectId',protect, saveProjectCode );
projectRouter.get('/rollback/:projectId/:versionId',protect, rollbackToVersion );
projectRouter.delete('/:projectId',protect, deleteproject);
projectRouter.get('/preview/:projectId',protect, getProjectPreview);
projectRouter.get('/published',protect, getPublishedProjects);
projectRouter.get('/published/:projectId',protect, getProjectById);
export default projectRouter