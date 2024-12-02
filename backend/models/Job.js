import Sequelize, { Model } from 'sequelize';

export default class Job extends Model {
  static init(sequelize) {
    super.init(
      {
        numberOfHours: {
          type: Sequelize.FLOAT,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'The number of hours is mandatory',
            },
          },
        },
        valuePerHour: {
          type: Sequelize.FLOAT,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'The hourly rate is mandatory',
            },
          },
        },
        workDate: {
          type: Sequelize.DATE,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Date of employment is mandatory',
            },
            isDate: {
              msg: 'The work date must be a valid date',
            },
          },
        },
        employer: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'The employer is required',
            },
          },
        },
        location: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'The place is required',
            },
          },
        },
      },
      {
        sequelize,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}
