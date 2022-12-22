import {useEffect, useState} from "react";
import {deleteStorage, querryFilter} from "../service";
import {DropDownList} from "@progress/kendo-react-dropdowns";
import {filterBy} from "@progress/kendo-data-query";
import {Button} from "@progress/kendo-react-buttons";

const ManageFilter = (props) => {
    let [filters, setFilters] = useState([]);
    let [data, setData] = useState(filters.slice());
    let [selectedValue, setSelectedValue] = useState(null);
    useEffect(() => {
        (async () => {
            let data = await querryFilter();
            let flatData = data.map(e => {
                return {
                    key: e.key,
                    filterName: e.value.filterName,
                    dateRange: e.value.dateRange,
                    issueLinkType: e.value.issueLinkType,
                    projects: e.value.projects,
                    fixedVersions: e.value.fixedVersions
                }
            })
            setData(flatData)
            setFilters(flatData);
        })();
    }, [props]);
    const filterData = (filter) => {
        const data = filters.slice();
        return filterBy(data, filter);
    };
    const filterChange = (event) => {
        setData(filterData(event.filter));
    };
    const onChange = (event) => {
        setSelectedValue(event.value);
    };
    const query = () => {
        props.onQuery(
            selectedValue.projects,
            selectedValue.issueLinkType,
            "",
            selectedValue.dateRange,
            selectedValue.fixedVersions);
    }
    return (
        <div>
            <h2>Manage Filter</h2>
            <DropDownList
                style={{
                    width: "300px",
                }}
                data={data}
                textField="filterName"
                onChange={onChange}
                filterable={true}
                value={selectedValue}
                onFilterChange={filterChange}
            />
            <Button
                size={'medium'}
                themeColor={'info'}
                fillMode={'solid'}
                rounded={'medium'}
                disabled={selectedValue === null}
                onClick={query}
            >
                Query
            </Button>
            <Button
                size={'medium'}
                themeColor={'warning'}
                fillMode={'solid'}
                rounded={'medium'}
                disabled={selectedValue === null}
                onClick={() => {
                    deleteStorage(selectedValue.key);
                    setFilters(filters.filter((e) => e.key !== selectedValue.key));
                    setData(filters.filter((e) => e.key !== selectedValue.key));
                    setSelectedValue(null)
                }}
            >
                Delete
            </Button>
            <Button
                size={'medium'}
                themeColor={'success'}
                fillMode={'solid'}
                rounded={'medium'}
                disabled={selectedValue === null}
                onClick={query}
            >
                Share
            </Button>
            <br></br>
        </div>
    );
};
export default ManageFilter;
