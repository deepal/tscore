export interface IBasicAuthInfo {
    username: string;
    password: string;
}

export function basicAuthParser(authHeader: string = '') : IBasicAuthInfo {
    const [username, password]
        = Buffer.from(authHeader.split('Basic ')[1], 'base64')
            .toString('utf8')
            .split(':');
    return { username, password };
}
