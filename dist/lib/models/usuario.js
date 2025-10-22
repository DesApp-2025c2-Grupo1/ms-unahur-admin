"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = require("sequelize");

class Usuario extends _sequelize.Model {
  static init(sequelize) {
    return super.init({
      nombre: _sequelize.DataTypes.STRING,
      apellido: _sequelize.DataTypes.STRING,
      fechaNacimiento: _sequelize.DataTypes.DATEONLY,
      avatarUrl: _sequelize.DataTypes.STRING,
      // Este "campo" no se persiste, se calcula a partir de otro/s.
      edad: {
        // Definimos el tipo (INTEGER) y de qué atributo/s depende (fechaNacimiento).
        type: new _sequelize.DataTypes.VIRTUAL(_sequelize.DataTypes.INTEGER, ['fechaNacimiento']),
        get: function () {
          return Math.floor((new Date() - new Date(this.get('fechaNacimiento'))) / (1000 * 60 * 60 * 24 * 365.25));
        }
      }
    }, {
      sequelize,
      modelName: 'Usuario'
    });
  }

  esTocayoDe(otroUsuario) {
    return otroUsuario.nombre === this.nombre;
  }

}

exports.default = Usuario;
//# sourceMappingURL=usuario.js.map