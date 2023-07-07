import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginUserSchema, options } from '../utils/utils';
import User from '../model/registerModel';

const jwtSecret = process.env.JWT_SECRET_KEY as string;

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate with Joi
    const { error } = loginUserSchema.validate(req.body, options);

    if (error) {
      return res.status(400).json({ error: error.details.map((detail: { message: any; }) => detail.message) });
    }

    // Find user in the database
    const user = await User.findOne({
      where: { email: email },
    });

    // Check if user exists and password is correct
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    // Generate token
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '30d' });

    return res.status(200).json({
      message: 'User logged in successfully',
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
