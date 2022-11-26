import { requestJira } from "@forge/bridge"

const linkType = {
    id: '10006', name: 'Hierarchy link (WBSGantt)', inward: 'is contained in', outward: 'contains'
}
const projectKey = `TD`;
const data = async () => {
    const params = `project = "${projectKey}" AND (filter != IsContainedIn)`;
    const response = await requestJira(`/rest/api/2/search?jql=${params}`);
    return await response.json();
};

const issueData = async () => {
    const result = await data();
    console.log(result);
    let issues = [];
    await Promise.all(result.issues.map(async (element)=> {
        let item = {
            id: element.id,
            key: element.key,
            summary: element.fields.summary,
            assignee:element.fields.assignee,
            status: {text:element.fields.status.name},
            storyPoint: element.fields.customfield_10033,
            issueType: element.fields.issuetype.name
        }

        let children = await findChildByJql(item);
        item.issues = children;
        issues.push(item)
    }))
    return issues;
}

export const findChildByJql = async (issue) => {
    let jqlFindChildByID = `project = "${projectKey}" and issue in linkedIssues("${issue.key}", ${linkType.outward})`
    let url = `/rest/api/2/search?jql=${jqlFindChildByID}`
    const response = await requestJira(url);
    const data = await response.json();
    let listChildren = []
    await data.issues.forEach(element => {
        let item = {
            id: element.id,
            key: element.key,
            summary: element.fields.summary,
            assignee: element.fields.assignee,
            status: {text:element.fields.status.name},
            storyPoint: element.fields.customfield_10033,
            issueType: element.fields.issuetype.name
        }
        listChildren.push(item);
    })
    return listChildren;
}
const getIssueLinks = async (issueKey) => {
    const response = await requestJira(`/rest/api/3/issue/${issueKey}?fields=issuelinks`);
    const data = await response.json()
    return await data.fields.issuelinks
}
export default issueData;