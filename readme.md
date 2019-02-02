# TSCore

http://tscore.deepal.io/

![](https://img.shields.io/npm/v/@dpjayasekara/tscore.svg?colorB=brightgreen&style=flat-square)
![](https://img.shields.io/david/dpjayasekara/tscore.svg?style=flat-square)
![](https://img.shields.io/travis/dpjayasekara/tscore/master.svg?style=flat-square)
[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT) 

![](https://github.com/dpjayasekara/tscore/raw/master/docs/logo.png)

TSCore is a dependency injection container to develop REST APIs with NodeJS. In comes with a built-in http server powered by Express.js. TSCore is completely written in TypeScript, and comes all the type definitions built in.

### Why do you need it?

TSCore is not the silver bullet, but it helps you bootstrap your REST API in a matter of minutes. It comes with a built-in Express sever including, 
- JSON Body parser using `body-parser`
- Basic auth header parser
- Secure HTTP Headers configuration using `helmet`
- A dependency injection container
- Built-in `bunyan` logger

**More customizations are coming!!!**

### Installation

```sh
npm i @dpjayasekara/tscore
```

## Usage

For a sample application, please checkout : https://github.com/dpjayasekara/tscore-sample-app

Write your code as individual modules with the following signature

### Module

The following is an example for a tscore module.

```js
import { Constants } from '@dpjayasekara/tscore';

export default class YourModule {
    private container;
    private logger;
    private config;

    constructor(container, logger, config) {
        // access the container instance
        this.container = container;

        // access the logger instance
        this.logger = logger;

        // access the configuration object for this module
        this.config = config;

        // triggers yourFunction() when all the modules are loaded
        this.container.on(Constants.EVENT.APPLICATION_START, this.yourFunction.bind(this));
    }

    public yourFunction() {
        // do your thing
    }
}

```

### Launcher

You can use `Launcher` to to bootstrap your application.

```js
import {Launcher, ConfigLoader} from '@dpjayasekara/tscore'

const launcher = new Launcher();

launcher
    .onBaseDir(__dirname)                           // optional function call. defaults to process.cwd()
    .withConfig(ConfigLoader.localConfigLoader({    // optional if config loading is required
        filePath: './config.json'
    }))
    .withLoggerConfig({                             // optional if no explicit minimum log level or log file is not configured
        name: 'myapp',
        level: 'debug'
    })
    .module({ name: 'a', path: './moduleA.ts'})
    .module({ name: 'b', path: './moduleB.ts'})
    .module({ name: 'server', path: './main.ts'})
    .start();

```

What is happening here:

- ModuleA is a typescript/javascript module which will be injected to the container with name `a`. This module can be accessed by any other injected module as follows assuming the module follows the aforementioned tscore module structure.

```
const moduleA = this.container.module('a');
```

- ModuleB is a typescript/javascript module which will be injected to the container with name `b`
- Server is the main module of our application. We need to start the server, only if all the other modules are loaded. This can be done by listening on the `APPLICATION_START` event emitted from the container. The following is the structure of your main module:

```js
import { Container, Constants } from '@dpjayasekara/tscore';

export default class Main {
    private container;
    private logger;
    private config;
    private serviceA;
    private serviceB;

    constructor(container, logger, config) {
        this.container = container;
        this.logger = logger;
        this.config = config;
        this.startServer = this.startServer.bind(this)
        this.requestLogger = this.requestLogger.bind(this)

        this.serviceA = this.container.module('a');
        this.serviceB = this.container.module('b');

        this.container.on(Constants.EVENT.APPLICATION_START, this.startServer);
    }

    private startServer() {
        // start the server
    }
}

```

In the above example, `startServer()` will be called once all the modules are loaded, and that is the exact place you need to fire up your server.

### API

http://tscore.deepal.io

### Roadmap

- [x] Launcher:Async configuration loading support
- [ ] Server:Customizing server headers
- [ ] Server:Request signing module
- [ ] Launcher:Custom logger support
- [ ] Server:Configurable health check endpoint
- [ ] Launcher:TSCore Submodules