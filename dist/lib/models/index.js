"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = require("path");

var _sequelize = _interopRequireDefault(require("sequelize"));

var _config = _interopRequireDefault(require("../config/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const thisFile = (0, _path.basename)(module.filename);
const dbConfig = _config.default.db;

function initSequelize() {
  return dbConfig.use_env_variable ? new _sequelize.default(process.env[dbConfig.use_env_variable]) : new _sequelize.default(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

const sequelize = initSequelize();

const isHiddenFile = file => file.startsWith('.');

const isJsFile = file => (0, _path.extname)(file) === '.js';

const isTestFile = file => file.includes('.test.js');

const isThisFile = file => file === thisFile;

const db = {};

_fs.default.readdirSync(__dirname).filter(file => !isHiddenFile(file) && !isThisFile(file) && isJsFile(file) && !isTestFile(file)).forEach(file => {
  const model = require((0, _path.join)(__dirname, file)).default;

  model.init(sequelize);
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = _sequelize.default;
var _default = db;
exports.default = _default;
//# sourceMappingURL=index.js.map