import {MultiSelect} from "@progress/kendo-react-dropdowns";
import {useEffect, useState} from "react";
import {gerProjectVersions} from "../service";

const FixedVersionFilter = (props) => {
    let [data, setData] = useState([]);
    let [value, setValue] = useState(props.value);

    useEffect(() => {
        (async () => {
            let result = []
            Promise.all(props.projects.map(async (project) => {
                let versions = await gerProjectVersions(project.key);
                versions.map((v) => result.push(v.name))
            })).then(() => {
                setData(result)
                if (result.length === 0) {
                    setValue("");
                }
            })
        })()
    }, [props.projects])
    useEffect(()=>{
        setValue(props.value)
    },[props.value])
    const filterChange = () => {
        console.log('123')
    }
    return <MultiSelect
        disabled={data.length === 0}
        data={data}
        filterable={true}
        value={value}
        onFilterChange={filterChange}
        placeholder="Fixed Versions"
        style={{
            width: "300px",
        }}
        onChange={(e) => {
            props.onChangeFixedVersion(e.target.value);
            setValue(e.target.value);
        }}
    />
}
export default FixedVersionFilter;