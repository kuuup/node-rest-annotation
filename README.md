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
bindServices(app);

app.use(express.static(__dirname + '/dist'));
app.listen(3000);

console.log('Listening on port 3000...'); 

```

Create a class that implements your remote methods

```javascript

import { restApi } from 'node-rest-annotation';

export default class MyClass {

    @restApi
    method1(a) {
        return {a: a} ;
    }
    
    @restApi
    method2(a, b) {
        return {a: a, b: b};
    }
    
    @restApi
    method3() {
        return('no params');
    }
}

```

Start your server and open [http://localhost:3000/api/print](http://localhost:3000/api/print) in your browser to see your API summary.

### Requirements
Be sure to have your environment configured for es7. In my case I use Babel 6 and this .babelrc:

```
{
  'presets': ['es2015', 'stage-0'],
  'plugins': ['transform-decorators-legacy']
}

```