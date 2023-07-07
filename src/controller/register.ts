import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { UserAttributes } from '../model/registerModel';
import registerSchema from '../utils/registerValidation';

import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';


export const register = async (req: Request, res: Response) => {
  const { fullName, email, password, confirmPassword } = req.body;

//  Validate input data using Joi schema
 const { error } = registerSchema.validate({ fullName, email, password, confirmPassword });
 if (error) {
   return res.status(400).send(error.details[0].message);
 }

  try {
    const userExist = await User.findOne({ where: { email } });

    if (userExist) {
      return res.status(400).send('This user already exists');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser: UserAttributes = {
      id: uuidv4(),
      fullName,
      email,
      password: encryptedPassword,
      isAdmin: email === 'admin@yahoo.com',
    };

    const createdUser = await User.create(newUser);

    const token = jwt.sign(
      { id: createdUser.id, email: createdUser.email, isAdmin: createdUser.isAdmin },
      process.env.JWT_SECRET_KEY || 'SECRET-KEY',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      userDetails: createdUser,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send('An error occurred, please try again');
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    // Delete all users and their associated products from the database
    await User.destroy({
      where: {
        email: {
          [Op.ne]: 'admin@yahoo.com', // Exclude the admin user from deletion
        },
      },
      truncate: true,
      cascade: true, // Enable cascading delete for associated products
    });

    return res.status(200).send('All users and their associated products have been deleted successfully');
  } catch (err) {
    console.log(err);
    return res.status(500).send('An error occurred while deleting users and their associated products');
  }
};
