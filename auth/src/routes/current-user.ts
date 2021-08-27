import express from 'express';
import { currentUser, requireAuth } from '@gtxticketing/common';

const router = express.Router();

router.get('/currentuser',  currentUser, (req, res) => {
  res.status(201).send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
