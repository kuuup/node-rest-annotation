# node-rest-annotation
Create simple REST endpoints

### Example
Create a server (i.e. with express)

```javascript

import express from 'express';
import { bindServices } from 'node-rest-annotation';

// Class will be instantiated by this lib. 
// Constructor parameters are not available for now
import './myclass';

const app = express();

// Bind all remote methods
// If 'json' is set input parameters will parsed.
// Leave this empty and you'll get strings.
bindServices(app, 'json');

// Do more with your server
// app.use(express.static(__dirname + '/dist'));

app.listen(3000);

console.log('Listening on port 3000...'); 

```

Create a class that implements your remote methods

```javascript

import { restApi } from 'node-rest-annotation';

export default class MyClass {

    @restApi
    method1(a) {
        return Promise.resolve([a]) ;
    }
    
    @restApi
    method2(a, b) {
        return {a: a, b: b};
    }
    
    //If you have a parameter called `req` in your annotated method it will contain the server request object.
    @restApi
    method3(req) {
        return req.headers;
    }
}

```

- Start your server and open [http://localhost:3000/api/print](http://localhost:3000/api/print) in your browser to see your API summary.
- Call a method [http://localhost:3000/myclass/method2?b=1&a={"foo":"bar"}](http://localhost:3000/myclass/method2?b=1&a={"foo":"bar"})

### Requirements
Be sure to have your environment configured for es7. In my case I use Babel 6 and this .babelrc:

```
{
  'presets': ['es2015', 'stage-0'],
  'plugins': ['transform-decorators-legacy']
}

```