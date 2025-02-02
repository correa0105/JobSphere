import jwt from 'jsonwebtoken';
import User from '../models/User';

class LoginController {
  async store(req, res) {
    const { email = '', password = '' } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        errors: ['Credenciais inválidas.'],
      });
    }

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          errors: ['Usuário não existe.'],
        });
      }

      if (!(await user.passwordIsValid(password))) {
        return res.status(401).json({
          errors: ['Senha inválida.'],
        });
      }

      const { id } = user;
      const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });

      return res.json({ token, user: { id, email, name: user.name } });
    } catch (error) {
      return res.status(500).json({
        errors: ['Erro ao processar a solicitação de login.'],
      });
    }
  }
}

export default new LoginController();
