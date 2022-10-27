import {requestJira} from "@forge/bridge"
import employees from "./data";

const linkType = {
    id: '10006', name: 'Hierarchy link (WBSGantt)', inward: 'is contained in', outward: 'contains'
}
const projectKey = `TD`;
const data = async () => {
    const params = `project = "${projectKey}" AND ( issueLinkType = "${linkType.outward}" OR issueLinkType = null )`;
    const response = await requestJira(`/rest/api/2/search?jql=${params}`);
    console.log('call api jira');
    return await response.json();
};
const issueData = data().then((result) => {
    let data = [];
    console.log(result)
    result.issues.forEach((element) => {
        let item = {
            id: element.id,
            key: element.key,
            summary: element.fields.summary
        }
        findChild(item, element.fields.issuelinks);
        data.push(item);
    });

    return data;
});
const findChild = (item, issueLinks) => {
    let children = []
    issueLinks.forEach(issueLink => {
        if (issueLink.type.id === linkType.id && issueLink.outwardIssue !== undefined) {
            let child = {
                id: issueLink.outwardIssue.id,
                key: issueLink.outwardIssue.key,
                summary: issueLink.outwardIssue.fields.summary
            }
            children.push(child)
        }
    })
    if (children.length > 0) item.issues = children;
}
export default issueData;