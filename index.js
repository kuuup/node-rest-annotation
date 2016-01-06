const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

const getParamNames = func => {
    let fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}

let services = new Map();
let instances = new Map();

export const restApi = (target, key, descriptor) => {
    
    const service = target.constructor.name;
    const url = '/' + service.toLowerCase() + '/' + key;
    
    if(!instances.has(service)) {
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

export const bindServices = express => {
    services.forEach(service => {
        express.get(service.url, (req, res) => {

            if (service.params) {
                const paramArray = [];
                const missingParams = [];

                service.params.forEach(param => {
                    if (req.query[param]) {
                        paramArray.push(req.query[param]);
                    }
                    else {
                        missingParams.push(param);
                    }
                });

                if (missingParams.length === 0) {
                    res.send(service.method.apply(instances.get(service.service), paramArray));
                }
                else {
                    res.send({
                        error: 'Parameter missing!',
                        value: missingParams
                    });
                }

            }
            else {
                res.send(service.method.call(instances.get(service.service)));
            }

        });
    });

}

class Api {
    
    createApi() {
        const api = {};

        services.map(method => {
            api[method.service] = api[method.service] || {};
            api[method.service][method.name] = {
                url: method.url,
                params: method.params
            }
        });

        return api;
    }
    
    @restApi
    print() {
         return '<pre>' + JSON.stringify(this.createApi(), null, '\t') + '</pre>';
    }
    
}
