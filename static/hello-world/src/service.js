import { requestJira } from "@forge/bridge"
const linkType = {
    id: '10006', name: 'Hierarchy link (WBSGantt)', inward: 'is contained in', outward: 'contains'
}
const deleteIssueLink = async (issueLinkID) => {
    console.log(issueLinkID);
    const response = await requestJira(`/rest/api/3/issueLink/${issueLinkID}`,
        {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.text());

}
const linkNewIssue = async (outwardKey, inwardKey) => {
    let body = {
        "outwardIssue": {
            "key": outwardKey
        },
        "inwardIssue": {
            "key": inwardKey
        },
        "type": {
            "name": linkType.name
        }
    }
    const response = await requestJira(`/rest/api/3/issueLink`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.text());

}
const updateIssueLink = async (newParent, oldParent, child) => {
    if (oldParent !== null) {
        const response = await requestJira(`/rest/api/3/issue/${child.key}?fields=issuelinks`);
        const data = await response.json()
        const oldIssueLinksChild = await data.fields.issuelinks
        const oldIssueLink = await oldIssueLinksChild.find(
            element =>
            (element.inwardIssue !== undefined
                && element.type.id === linkType.id
                && element.inwardIssue.id === oldParent.id));
        //delete old issue link
        deleteIssueLink(oldIssueLink.id)
    }
    //add new link issue
    linkNewIssue(child.key, newParent.key)

}
export default updateIssueLink;