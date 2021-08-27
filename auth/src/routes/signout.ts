import express from 'express';

const router = express.Router();

router.post('/signout', async (req, res, next) => {
  //store token in cookie
  req.session = null;
  
  res.status(201).send({});
});

export { router as signOutRouter };
