import { requestJira } from "@forge/bridge"

const linkType = {
    id: '10006', name: 'Hierarchy link (WBSGantt)', inward: 'is contained in', outward: 'contains'
}
const projectKey = `TD`;
const data = async () => {
    const params = `project = "${projectKey}" AND (filter != IsContainedIn)`;
    const response = await requestJira(`/rest/api/2/search?jql=${params}`);
    console.log('call api jira');
    return await response.json();
};

const issueData = data().then(result => {
    let issues = [];
    result.issues.forEach((element) => {
        let item = {
            id: element.id,
            key: element.key,
            summary: element.fields.summary
        }
        findChild(item, element.fields.issuelinks);
        issues.push(item);
    });
    return issues;
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
            getIssueLinks(issueLink.outwardIssue.key).then(result => {
                findChild(child, result);
            })
            children.push(child)
        }
    })
    if (children.length > 0) item.issues = children;
}
const getIssueLinks = async (issueKey) => {
    const response = await requestJira(`/rest/api/3/issue/${issueKey}?fields=issuelinks`);
    const data = await response.json()
    return await data.fields.issuelinks
}
export default issueData;