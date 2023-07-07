import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import Product from './productModel';

export interface UserAttributes {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}


class User extends Model<UserAttributes, UserAttributes> implements UserAttributes {

  id!: string;
  fullName!: string;
  email!: string;
  password!: string;
  isAdmin!: boolean; 
  idToken: any;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,
  }
);

User.hasMany(Product, { foreignKey: 'userId', as: 'Products' });
Product.belongsTo(User, { foreignKey: 'userId', as: 'User' });

export default User;
