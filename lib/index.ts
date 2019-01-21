import {Request, Response} from 'express';
import {Logger} from './logger';
import {Server} from './server';

const server : Server = new Server();
const logger : Logger = new Logger({
    name: 'myapp',
    level: 'trace'
});

server
    .route({ method: 'get', path: '/', handler: (req: Request, res: Response) : Response => res.send('root')})
    .route({ method: 'get', path: '/test', handler: (req: Request, res: Response) : Response => res.send('test')})
    .route({ method: 'get', path: '/abc', handler: (req: Request, res: Response) : Response => res.send('abc')})
    .listen({host: '0.0.0.0', port: 2234})
    .on('listening', () => {
        logger.info('server is listening');
    })
    .on('request', (req : Request) => {
        logger.info(`${req.method} ${req.url}`);
    });
