import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database';
import User from '../models/User';
import Job from '../models/Job';
import Employer from '../models/Employer';

export default class Connection {
  constructor() {
    this.sequelize = new Sequelize(databaseConfig);
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log('Conectado com sucesso!');
    } catch (err) {
      console.log('Não foi possivel conectarse ao banco de dados...', err);
    }
  }

  async syncModels() {
    try {
      Employer.init(this.sequelize);
      User.init(this.sequelize);
      Job.init(this.sequelize);
      Employer.associate(this.sequelize.models);
      User.associate(this.sequelize.models);
      Job.associate(this.sequelize.models);

      await this.sequelize.sync();
      console.log('Tabelas sincronizadas');
    } catch (err) {
      console.log('Não foi possivel sincronizar as tabelas...', err);
    }
  }
}
