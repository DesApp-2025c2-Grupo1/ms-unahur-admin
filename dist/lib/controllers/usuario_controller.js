"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.show = exports.index = void 0;

var _usuario = _interopRequireDefault(require("../models/usuario"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const index = async (req, res) => {
  const usuarios = await _usuario.default.findAll({});
  res.json({
    data: usuarios.map(usuario => usuario.toJSON())
  });
};

exports.index = index;

const show = async (req, res) => {
  const usuario = await _usuario.default.findByPk(req.params.id);

  if (usuario) {
    res.json({
      data: usuario.toJSON()
    });
  } else {
    res.status(404).json({
      message: `No se encontró un usuario con id ${req.params.id}`
    });
  }
};

exports.show = show;
//# sourceMappingURL=usuario_controller.js.map