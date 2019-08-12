import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';
import Subscription from '../app/models/Subscription';

const models = [User, File, Meetup, Subscription];

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);

    this.connections();
    this.associations();
  }

  connections() {
    models.forEach(model => model.init(this.connection));
  }

  associations() {
    models.forEach(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
