import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import User from './registerModel';

export interface ProductAttributes {
  id: string;
  userId: string;
  numberCompanies: number;
  numberProducts: number;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  id!: string;
  userId!: string;
  numberCompanies!: number;
  numberProducts!: number;
  User: any;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    numberCompanies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numberProducts: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    timestamps: true,
  }
);

export default Product;
