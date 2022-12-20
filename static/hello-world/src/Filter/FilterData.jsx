import LinkedIssueType from "./LinkedIssueTypeFilter";
import ProjectFilter from "./ProjectFilter";
import IssueKeyFilter from "./IssueKeyFilter";
import { useEffect, useState } from "react";
import DateRangeFilter from "./DateRangeFilter";
const FilterData = (props) => {
  let [projects, setProjects] = useState([]);
  let [issueLinkType, setIssueLinkType] = useState("");
  let [issueKey, setIssueKey] = useState("");
  let [dateRange, setDateRange] = useState();
  useEffect(() => {
    if (props.options) {
      setProjects(props.options.projects);
      setIssueLinkType(props.options.issueLink);
      setDateRange(props.options.dateRange);
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
  const search = () => {
    props.onQuerry(projects, issueLinkType, issueKey, dateRange);
  };
  return (
    <>
      <ProjectFilter value={projects} onChangeProject={onChangeProject} />
      <LinkedIssueType
        value={issueLinkType}
        onChangeLinkIssueType={onChangeLinkIssueType}
      />
      <IssueKeyFilter onChangeIssueKey={onChangeIssueKey} />
      <DateRangeFilter value={dateRange} onChangeDateRange={onChangeDateRange}></DateRangeFilter>
      <button
        title="Search"
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
        onClick={search}
      >
        Search
      </button>
    </>
  );
};
export default FilterData;
