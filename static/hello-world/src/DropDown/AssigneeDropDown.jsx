import { AutoComplete } from "@progress/kendo-react-dropdowns";
import { filterBy } from "@progress/kendo-data-query";
import React, { useCallback, useEffect, useState } from "react";
import { requestJira } from "@forge/bridge";

export const AssigneeDropDown = (props) => {
  const [users, setUsers] = useState([]);
  const [state, setState] = React.useState({
    data: users,
    value:
      props.dataItem.aassignee !== undefined && props.dataItem.assignee !== null
        ? props.dataItem.assignee.displayName
        : null,
    opened: false,
  });

  useEffect(() => {
    (async () => {
      let result = await getListUser();
      let atlassianAccount = result.filter(
        (e) => e.accountType === "atlassian" && e.active === true
      );
      setUsers(
        atlassianAccount.map((e) => {
          return { text: e.displayName, id: e.accountId };
        })
      );
    })();
  }, []);

  const onChange = (event) => {
    const value = event.target.value;
    const filterData = (value) => {
      return users.filter((e) =>
        e.text.toLowerCase().includes(value.toLowerCase())
      );
    };
    const stateData =
      value.length < 3
        ? {
            data: users,
            opened: false,
          }
        : {
            data: filterData(value),
            opened: true,
          };
    const eventType = event.nativeEvent.type;
    const nativeEvent = event.nativeEvent;
    const valueSelected =
      eventType === "click" ||
      (eventType === "keydown" && nativeEvent.keyCode === 13);
    if (valueSelected && stateData.data.map((e) => e.text).includes(value)) {
      stateData.opened = false;
    }
    setState({
      value: value,
      ...stateData,
    });
    if (props.onChange && valueSelected && !stateData.opened) {
      setState({
        value: value,
        ...stateData,
      });
      props.onChange({
        dataItem: props.dataItem,
        level: props.level,
        field: props.field,
        syntheticEvent: event,
        value: users.find((e) => e.text === value),
      });
    }
  };
  return (
    <td>
      <AutoComplete
        style={{
          width: "300px",
        }}
        data={state.data}
        value={state.value}
        onChange={onChange}
        opened={state.opened}
        textField={"text"}
      />
    </td>
  );
};
export default AssigneeDropDown;

const getListUser = async () => {
  const response = await requestJira(`/rest/api/3/users/search`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  console.log(`Response: ${response.status} ${response.statusText}`);
  const result = await response.json();
  return result;
};
