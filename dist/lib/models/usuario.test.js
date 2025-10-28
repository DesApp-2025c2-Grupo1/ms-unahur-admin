"use strict";

var _db_utils = require("../../test/db_utils");

var _usuario = _interopRequireDefault(require("./usuario"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Usuario', () => {
  let fede;
  beforeAll(async () => {
    // Borramos todos los datos preexistentes en la base.
    await (0, _db_utils.cleanDb)();
    fede = await _usuario.default.create({
      fechaNacimiento: '1991-10-30',
      nombre: 'Fede',
      apellido: 'Aloi'
    }); // Fijamos la fecha actual con un fake para que el test no dependa del día en que se ejecuta.

    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2020-12-16').getTime());
  });
  afterAll(() => {
    // Volvemos a la fecha real.
    jest.useRealTimers();
  });
  test('campos básicos', () => {
    // Usamos toMatchObject y no toEquals para que solo mire los atributos que especificamos.
    expect(fede).toMatchObject({
      nombre: 'Fede',
      fechaNacimiento: '1991-10-30'
    });
  });
  test('edad - se calcula a partir de la fecha de nacimiento', () => {
    expect(fede.edad).toEqual(29);
  });
  describe('es tocayo de', () => {
    // El método build crea un objeto pero no lo persiste, por eso no hace falta el await.
    const otroFede = _usuario.default.build({
      nombre: 'Fede',
      apellido: 'Sierra'
    });

    const daiana = _usuario.default.build({
      nombre: 'Daiana',
      apellido: 'Sierra'
    });

    test('alguien con el mismo nombre', () => {
      expect(fede.esTocayoDe(otroFede)).toBeTruthy();
    });
    test('alguien con otro nombre', () => {
      expect(fede.esTocayoDe(daiana)).toBeFalsy();
    });
  });
});
//# sourceMappingURL=usuario.test.js.map