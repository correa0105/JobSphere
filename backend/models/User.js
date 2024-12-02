import Sequelize, { Model } from 'sequelize';
import bcryptjs from 'bcryptjs';

export default class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'The name is mandatory.',
            },
            len: {
              args: [3, 255],
              msg: 'The name must contain between 3 and 255 characters.',
            },
          },
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: {
            msg: 'Email already registered.',
          },
          validate: {
            notNull: {
              msg: 'Email is mandatory',
            },
            isEmail: {
              msg: 'Invalid email.',
            },
          },
        },
        password_hash: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.VIRTUAL,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'A senha é obrigatória',
            },
            len: {
              args: [8, 36],
              msg: 'The password must contain between 8 and 36 characters.',
            },
          },
        },
      },
      {
        sequelize,
      },
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Job, { foreignKey: 'user_id' });
  }

  passwordIsValid(password) {
    return bcryptjs.compare(password, this.password_hash);
  }
}
