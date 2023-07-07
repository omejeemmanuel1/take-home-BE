import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createProductSchema, options } from '../utils/utils';
import Product, { ProductAttributes } from '../model/productModel';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../model/registerModel';



export const createProduct = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ Error: 'Unauthorized' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret);

    if (!verified) {
      return res.status(401).json({ Error: 'Token not valid' });
    }

    const { numberCompanies, numberProducts } = req.body;

    const validateResult = createProductSchema.validate({ numberCompanies, numberProducts }, options);

    if (validateResult.error) {
      return res.status(400).json({ Error: validateResult.error.details[0].message });
    }

    const userId = (verified as { id: string }).id;

    const productData: ProductAttributes[] = [];

    for (let i = 0; i < numberCompanies; i++) {
      const companyProducts: ProductAttributes[] = [];
      for (let j = 0; j < numberProducts; j++) {
        const id = uuidv4();
        const product: ProductAttributes = {
          id,
          userId,
          numberCompanies,
          numberProducts,
        };
        companyProducts.push(product);
      }
      productData.push(...companyProducts);
    }

    try {
      const newProducts = await Product.bulkCreate(productData);
      const groupedProducts = groupProductsByCompany(newProducts);
      return res.status(201).json(groupedProducts);
    } catch (error) {
      console.error('Failed to create the products:', error);
      return res.status(500).json({ Error: 'Failed to create the products' });
    }
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ Error: 'Internal Server Error' });
  }
};

const groupProductsByCompany = (products: ProductAttributes[]) => {
  const groupedProducts: { [key: string]: ProductAttributes[] } = {};

  products.forEach((product) => {
    if (!groupedProducts[product.userId]) {
      groupedProducts[product.userId] = [];
    }
    groupedProducts[product.userId].push(product);
  });

  const formattedOutput: any[] = [];

  for (const userId in groupedProducts) {
    const companyProducts = groupedProducts[userId];
    const company = `Company ${companyProducts[0].numberCompanies}`;
    const productIds = companyProducts.map((product) => product.id);
    const totalProducts = companyProducts.length;
    const companyOutput = {
      company,
      totalProducts,
      products: productIds,
    };
    formattedOutput.push(companyOutput);
  }

  return formattedOutput;
};





export const fetchAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      include: {
        model: User,
        as: 'User',
        attributes: ['id', 'fullName', 'email'],
      },
    });

    const usersData: { [fullName: string]: { totalCompanies: number, totalProducts: number } } = {};

    products.forEach((product: any) => {
      const user: any = product.User;
      if (user) {
        const fullName: string = user.fullName;
        if (!usersData[fullName]) {
          usersData[fullName] = {
            totalCompanies: 0,
            totalProducts: 0,
          };
        }
        usersData[fullName].totalProducts++;
      }
    });

    const users = Object.keys(usersData).map((fullName) => {
      const userStats = usersData[fullName];
      return `${fullName} total  product is ${userStats.totalProducts} for all company`;
    });

    const comparisonResult = {
      match: products.length === users.length,
      differenceInCompany: Math.abs(products.length - users.length),
    };

    return res.status(200).json({
      msg: 'You have successfully retrieved all products',
      users,
      comparison: comparisonResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'An error occurred while retrieving the products',
    });
  }
};

