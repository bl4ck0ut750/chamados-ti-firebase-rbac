const { User } = require('../models');

exports.index = async (req, res) => {
  const usuarios = await User.findAll({ order: [['nome', 'ASC']] });
  res.render('users/index', { title: 'Gestão de usuários', usuarios });
};

exports.updateRole = async (req, res) => {
  const perfil = ['user', 'tecnico', 'admin'].includes(req.body.perfil) ? req.body.perfil : null;
  if (!perfil) return res.redirect('/users?erro=Perfil inválido');
  if (String(req.params.id) === String(req.user.id) && perfil !== 'admin') return res.redirect('/users?erro=Você não pode remover o próprio perfil de administrador');
  await User.update({ perfil }, { where: { id: req.params.id } });
  res.redirect('/users?msg=Perfil atualizado com sucesso');
};
