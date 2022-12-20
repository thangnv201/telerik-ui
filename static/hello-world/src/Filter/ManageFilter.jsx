import { useEffect, useState } from "react";
import { formatDate } from "../fetchData";
import { querryFilter, deleteStorage } from "../service";
const ManageFilter = (props) => {
  let [filters, setFilters] = useState([]);
  useEffect(() => {
    (async () => {
      let data = await querryFilter();
      console.log("ManageFilter useEffect");
      setFilters(data);
    })();
  }, [props]);
  const querry = (filter) => {
    console.log(filter);
    props.onQuerry(filter.value.projects, filter.value.issueLinkType, "",filter.value.dateRange);
  };
  const share = () => {};
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Issue Link</th>
            <th>Projects</th>
            <th>Date Range</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filters.map((filter) => {
            return (
              <tr>
                <td>{filter.value.filterName}</td>
                <td>{filter.value.issueLinkType.text}</td>
                <td>
                  {filter.value.projects.map((e) => e.projectName).toString()}
                </td>
                <td>
                  {filter.value.dateRange
                    ? formatDate(filter.value.dateRange?.start) +
                      " - " +
                      formatDate(filter.value.dateRange?.end)
                    : "N/A"}
                </td>
                <td>
                  <button
                    onClick={() => {
                      querry(filter);
                    }}
                  >
                    Querry
                  </button>
                  <button onClick={share}>Share</button>
                  <button
                    onClick={() => {
                      deleteStorage(filter.key);
                      setFilters(filters.filter((e) => e.key != filter.key));
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br></br>
    </div>
  );
};
export default ManageFilter;
