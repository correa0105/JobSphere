import User from '../models/User';

import getToken from '../helpers/getToken';
import getUserByToken from '../helpers/getUserByToken';

class UserController {
  async store(req, res) {
    const { confirmpassword, password } = req.body;

    if (confirmpassword !== password) {
      return res.status(400).json({
        errors: ['As senhas não conferem.'],
      });
    }

    try {
      const newUser = await User.create(req.body);

      return res.json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors ? e.errors.map((err) => err.message) : ['Erro ao criar usuário.'],
      });
    }
  }

  async show(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    try {
      const result = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };

      return res.json(result);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (!user) {
      return res.status(400).json({
        errors: ['Usuário não encontrado!'],
      });
    }

    try {
      const attUser = await user.update(req.body);
      const { id, name, email } = attUser;

      return res.json({
        msg: 'Dados atualizados com sucesso!',
        user: {
          id,
          name,
          email,
        },
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (!user) {
      return res.status(400).json({
        errors: ['Usuário não encontrado!'],
      });
    }

    try {
      await user.destroy();

      return res.json({
        msg: 'Usuário removido com sucesso!',
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new UserController();
