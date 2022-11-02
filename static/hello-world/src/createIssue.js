import {
    requestJira
} from "@forge/bridge"

const createIssue = async (body) => {
    const response = await requestJira('/rest/api/3/issue', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
    })
    console.log(`Response: ${response.status} ${response.statusText}`);
    return await response.json()
}
export default createIssue;