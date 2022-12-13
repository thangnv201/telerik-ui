import Resolver from '@forge/resolver';
import {
    storage
} from '@forge/api';
const resolver = new Resolver();

resolver.define('getText', (req) => {
    return 'Hello world!';
});
resolver.define('getContext', (req) => {
    const context = req.context;
    return context;
})
resolver.define('setStorage', (req) => {
    storage.set(req.payload.key, req.payload.value)
})
resolver.define('getStorage', async (req) => {
    console.log(req);
    let value = await storage.get(req.payload.key);
    console.log(value);
    return value;
})


export const handler = resolver.getDefinitions();