'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _desc, _value, _class;

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

var getParamNames = function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) result = [];
    return result;
};

var services = new Map();
var instances = new Map();

var restApi = exports.restApi = function restApi(target, key, descriptor) {

    var service = target.constructor.name;
    var url = '/' + service.toLowerCase() + '/' + key;

    if (!instances.has(service)) {
        instances = instances.set(service, new target.constructor());
    }

    services = services.set(url, {
        service: service,
        name: key,
        url: url,
        method: descriptor.value,
        params: getParamNames(descriptor.value)
    });
};

var bindServices = exports.bindServices = function bindServices(express) {
    var type = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

    services.forEach(function (service) {
        express.get(service.url, function (req, res) {

            if (service.params) {
                (function () {
                    var paramArray = [];
                    var missingParams = [];

                    service.params.forEach(function (param) {
                        if (req.query[param]) {
                            if (type && type === 'json') paramArray.push(JSON.parse(req.query[param]));else paramArray.push(req.query[param]);
                        } else {
                            missingParams.push(param);
                        }
                    });

                    if (missingParams.length === 0) {

                        Promise.all([service.method.apply(instances.get(service.service), paramArray)]).then(function (result) {
                            return res.send(result[0]);
                        });

                        //res.send(service.method.apply(instances.get(service.service), paramArray));
                    } else {
                            res.send({
                                error: 'Parameter missing!',
                                value: missingParams
                            });
                        }
                })();
            } else {

                Promise.all([service.method.call(instances.get(service.service))]).then(function (result) {
                    return res.send(result[0]);
                });

                //res.send(service.method.call(instances.get(service.service)));
            }
        });
    });
};

var Api = (_class = (function () {
    function Api() {
        _classCallCheck(this, Api);
    }

    _createClass(Api, [{
        key: 'createApi',
        value: function createApi() {
            var api = {};

            services.forEach(function (method) {
                api[method.service] = api[method.service] || {};
                api[method.service][method.name] = {
                    url: method.url,
                    params: method.params
                };
            });

            return api;
        }
    }, {
        key: 'print',
        value: function print() {
            return '<pre>' + JSON.stringify(this.createApi(), null, '\t') + '</pre>';
        }
    }]);

    return Api;
})(), (_applyDecoratedDescriptor(_class.prototype, 'print', [restApi], Object.getOwnPropertyDescriptor(_class.prototype, 'print'), _class.prototype)), _class);
