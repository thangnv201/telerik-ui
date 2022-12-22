import LinkedIssueType from "./LinkedIssueTypeFilter";
import ProjectFilter from "./ProjectFilter";
import IssueKeyFilter from "./IssueKeyFilter";
import {useEffect, useState} from "react";
import DateRangeFilter from "./DateRangeFilter";
import FixedVersionFilter from "./FixedVersionFilter";

const FilterData = (props) => {
    let [projects, setProjects] = useState([]);
    let [issueLinkType, setIssueLinkType] = useState("");
    let [issueKey, setIssueKey] = useState("");
    let [dateRange, setDateRange] = useState();
    let [fixedVersions, setFixexVersions] = useState();
    useEffect(() => {
        if (props.options) {
            setProjects(props.options.projects);
            setIssueLinkType(props.options.issueLinkType);
            setDateRange(props.options.dateRange);
            setFixexVersions(props.options.fixedVersions)
        }
    }, [props]);
    const onChangeProject = (value) => {
        setProjects(value);
    };
    const onChangeLinkIssueType = (value) => {
        setIssueLinkType(value);
    };
    const onChangeIssueKey = (value) => {
        setIssueKey(value);
    };
    const onChangeDateRange = (value) => {
        setDateRange(value);
    };
    const onChangeFixedVersion = (value) => {
        setFixexVersions(value)
    }
    const search = () => {
        console.log(fixedVersions)
        props.onQuery(projects, issueLinkType, issueKey, dateRange,fixedVersions);
    };
    return (
        <div>
            <br></br>
            <ProjectFilter value={projects} onChangeProject={onChangeProject}/>
            <LinkedIssueType
                value={issueLinkType}
                onChangeLinkIssueType={onChangeLinkIssueType}
            />
            <IssueKeyFilter onChangeIssueKey={onChangeIssueKey}/>
            <FixedVersionFilter projects={projects} value={fixedVersions}
                                onChangeFixedVersion={onChangeFixedVersion}></FixedVersionFilter>
            <DateRangeFilter value={dateRange} onChangeDateRange={onChangeDateRange}></DateRangeFilter>
            <button
                title="Search"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                onClick={search}
            >
                Search
            </button>
        </div>
    );
};
export default FilterData;
