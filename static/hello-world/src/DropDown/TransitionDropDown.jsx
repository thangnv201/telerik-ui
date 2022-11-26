import { ComboBox } from "@progress/kendo-react-dropdowns";
import { useEffect, useState } from "react";
import { requestJira } from "@forge/bridge";

export const TransitionDropdown = (props) => {
  console.log(props);
  let [transition, setTransition] = useState([]);
  useEffect(() => {
    console.log("useeffect");
    (async () => {
      let transitions = await getTransition(props.dataItem.key);
      console.log(transitions);
      let name = transitions.map((e) => {
        return { text: e.to.name, id: e.id };
      });
      setTransition(name);
      // setValue(name.find(e => e.text ===props.dataItem.status.text))
    })();
    console.log("done useeffect");
  }, []);
  const onChange = (event) => {
    if (props.onChange) {
      props.onChange({
        dataItem: props.dataItem,
        level: props.level,
        field: props.field,
        syntheticEvent: event,
        value: event.target.value,
      });
    }
  };
  return (
    <td>
      <ComboBox
        data={transition}
        onChange={onChange}
        textField={"text"}
        dataItemKey={"id"}
        value={props.dataItem["status.text"] ===undefined ? props.dataItem.status:props.dataItem["status.text"]}
      />
    </td>
  );
};
export default TransitionDropdown;
const getTransition = async (issueKey) => {
  const response = await requestJira(
    `/rest/api/3/issue/${issueKey}/transitions`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  const result = await response.json();
  return result.transitions;
};
