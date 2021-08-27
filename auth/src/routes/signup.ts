import express, { Response, Request } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

//errors
import { BadRequestError, RequestValidationError } from '@gtxticketing/common';

//models
import { User } from '../models/User';

const router = express.Router();

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new BadRequestError('email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    //generate jwt token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    //store token in cookie
    req.session = {
      jwt: token,
    };

    res.status(201).send({});
  }
);

export { router as signUpRouter };
