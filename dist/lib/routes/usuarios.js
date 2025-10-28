"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _usuario_controller = require("../controllers/usuario_controller");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.get('/', (0, _utils.withErrorHandling)(_usuario_controller.index));
router.get('/:id', (0, _utils.withErrorHandling)(_usuario_controller.show));
var _default = router;
exports.default = _default;
//# sourceMappingURL=usuarios.js.map