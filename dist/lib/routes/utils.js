"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorAwareRouter = errorAwareRouter;
exports.withErrorHandling = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const withErrorHandling = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.withErrorHandling = withErrorHandling;

function errorAwareRouter() {
  const basicRouter = _express.default.Router();

  function newRouter(...params) {
    basicRouter(...params);
  }

  newRouter.get = function (path, controller) {
    basicRouter.get(path, withErrorHandling(controller));
  };

  newRouter.post = function (path, controller) {
    basicRouter.post(path, withErrorHandling(controller));
  };

  newRouter.patch = function (path, controller) {
    basicRouter.patch(path, withErrorHandling(controller));
  };

  newRouter.delete = function (path, controller) {
    basicRouter.delete(path, withErrorHandling(controller));
  };

  newRouter.put = function (path, controller) {
    basicRouter.put(path, withErrorHandling(controller));
  };

  return newRouter;
}
//# sourceMappingURL=utils.js.map