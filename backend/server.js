import app from './app';
import Connection from './database/conn';

class Server {
  constructor() {
    this.connection = new Connection();
  }

  start() {
    this.connection
      .connect()
      .then(() => this.connection.syncModels())
      .then(() => app.listen(process.env.APP_PORT))
      .catch((err) => console.log(err));
  }
}

const server = new Server();
server.start();
