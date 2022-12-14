import Resolver from '@forge/resolver';
import {
    storage
} from '@forge/api';
const resolver = new Resolver();

resolver.define('getText', (req) => {
    return 'Hello world!';
});
resolver.define('getAccountID', (req) => {
    const accountID = req.context.accountId;
    return accountID;
})
resolver.define('setStorage', (req) => {
    storage.set(req.payload.key, req.payload.value)
})
resolver.define('getStorage', async (req) => {
    let value = await storage.get(req.payload.key);
    return value;
})


export const handler = resolver.getDefinitions();