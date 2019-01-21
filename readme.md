# TSCORE

[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT) [![status](https://img.shields.io/badge/status-development_pending-brightgreen.svg?style=flat-square)]()

A typescript based application bootstrapper for NodeJS/Express.js based REST APIs.

### Installation

```sh
npm i @dpjayasekara/tscore
```

## Usage

### Module

```js
import {TSModule} from '@dpjayasekara/tscore'

class MyModule extends TSModule {
    constructor() {

    }

    public init() : void {

    }

    public myCustomFunction(...params : any[]) : any{

    }
}
```

### Launcher
```js
import {launcher} from '@dpjayasekara/tscore'

launcher
    .withConfig()
    .module('module1', './module1/path/to/index.js')
    .module('module2', './module2/path/to/index.js')
    .module('module3', './module3/path/to/index.js')
    .main('api', './api/path/to/index.js')
    .start();
```

#### tscore.module
Initializes a submodule.

Syntax:
```js
tscore.module(moduleName, modulePath)
```

#### tscore.main

Initializes the main module. Once all the modules except the main module are loaded successfully, `tscore` will emit `START` event which can be listened to by the main module in order to launch the service. Usually, the `main` module should be used to start the server.

Syntax:
```js
tscore.main(moduleName, modulePath)
```

#### tscore.start
