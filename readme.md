# TSCORE

![](https://img.shields.io/npm/v/@dpjayasekara/tscore.svg?colorB=brightgreen&style=flat-square)
![](https://img.shields.io/david/dpjayasekara/tscore.svg?style=flat-square)
![](https://img.shields.io/npm/dm/@dpjayasekara/tscore.svg?style=flat-square)
[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT) 

A typescript based application bootstrapper for NodeJS/Express.js based REST APIs.

### Installation

```sh
npm i @dpjayasekara/tscore
```

## Usage

### Module

The following is an example for a tscore module.
```js
export default class ModuleA {
    private container : Container;
    private logger : Logger;
    private config : IConfigObj;

    constructor(container: Container, logger: Logger, config: IConfigObj) {
        this.container = container;
        this.logger = logger;
        this.config = config;
    }

    public printSomethingAboutA() {
        this.logger.info(`Hi, I'm from moduleA`);
    }
}

```

### Launcher
```js
import {Launcher} from '@dpjayasekara/tscore';

const launcher = new Launcher();

launcher
    .onBaseDir(__dirname)
    .withConfig('./config.json')
    .withLoggerConfig({
        name: 'myapp',
        level: 'debug'
    })
    .module({ name: 'a', path: './moduleA.ts'})
    .module({ name: 'b', path: './moduleB.ts'})
    .module({ name: 'main', path: './main.ts'})
    .start();
```

#### tscore.module
Initializes a submodule.

Syntax:
```js
tscore.module(moduleName, modulePath)
```
