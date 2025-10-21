"use strict";

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  development: _config.default.db,
  test: _config.default.db,
  production: _config.default.db
};
//# sourceMappingURL=config-sequelize.js.map