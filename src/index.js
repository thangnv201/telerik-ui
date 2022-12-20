import Resolver from '@forge/resolver';
import {
    startsWith,
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
resolver.define('querryFilter', async (req) => {
    let value =
        await storage.query()
        .where('key', startsWith('filter_'.concat(req.context.accountId)))
        .getMany();
    return value.results;
})
resolver.define('saveFilter', async (req) => {
    console.log(req.payload);
    await storage.set("filter_".concat(req.context.accountId).concat("_").concat(req.payload.filterName), req.payload);
})
resolver.define('deleteFilter', (req) => {
    storage.delete(req.payload.key)
})
export const handler = resolver.getDefinitions();