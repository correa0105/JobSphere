import Employer from '../models/Employer';

import getToken from '../helpers/getToken';
import getUserByToken from '../helpers/getUserByToken';

class UserController {
  async store(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        mensagem: 'Incomplete or invalid data!',
      });
    }

    try {
      const newEmployer = await Employer.create({
        name,
        user_id: user.dataValues.id,
      });

      return res.json({
        id: newEmployer.id,
        name: newEmployer.name,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    try {
      const employers = await Employer.findAll({
        attributes: ['id', 'name'],
      });

      if (employers.length === 0) {
        return res.status(404).json({
          message: 'No employers found.',
        });
      }

      return res.json(employers);
    } catch (e) {
      return res.status(500).json({
        errors: ['Error listing employers.'],
      });
    }
  }

  async delete(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    try {
      if (!user) {
        return res.status(400).json({
          errors: ['User not found!'],
        });
      }

      await user.destroy();

      return res.json({
        msg: 'User removed successfully!',
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new UserController();
