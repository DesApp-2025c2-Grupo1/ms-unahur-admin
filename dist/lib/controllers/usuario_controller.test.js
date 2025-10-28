"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _db_utils = require("../../test/db_utils");

var _app = _interopRequireDefault(require("../app"));

var _usuario = _interopRequireDefault(require("../models/usuario"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Usuario controller', () => {
  beforeAll(async () => {
    await (0, _db_utils.cleanDb)();
    await _usuario.default.bulkCreate([{
      nombre: 'Pepita',
      apellido: 'La pistolera'
    }, {
      nombre: 'Juana',
      apellido: 'Azurduy'
    }]);
  });
  describe('/usuarios', () => {
    let response;
    beforeAll(async () => {
      response = await (0, _supertest.default)(_app.default).get('/api/usuarios');
    });
    it('devuelve código 200', () => {
      expect(response.statusCode).toBe(200);
    });
    it('devuelve la lista de usuarios', () => {
      // Usamos toMatchObject y no toEquals para que solo mire los atributos que especificamos.
      expect(response.body).toMatchObject({
        data: [{
          nombre: 'Pepita',
          apellido: 'La pistolera'
        }, {
          nombre: 'Juana',
          apellido: 'Azurduy'
        }]
      });
    });
  });
});
//# sourceMappingURL=usuario_controller.test.js.map