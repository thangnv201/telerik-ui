import {AutoComplete} from "@progress/kendo-react-dropdowns";
import {filterBy} from "@progress/kendo-data-query";
import React, {useCallback, useState} from "react";

const source = ["Albania", "Andorra", "Armenia", "Austria", "Azerbaijan"];
export const AssigneeDropDown = (props, test) => {
    console.log(props)
    const [state, setState] = React.useState({
        data: source,
        value: "",
        opened: false,
    });
    console.log(state.value)
    const onChange = useCallback((event) => {
        console.log('onchange')
        const value = event.target.value;
        const filterData = (value) => {
            const data = source;
            const filter = {
                value: value,
                operator: "startswith",
                ignoreCase: true,
            };
            return filterBy(data, filter);
        };
        const stateData =
            value.length < 3
                ? {
                    data: source,
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
        if (valueSelected && stateData.data.includes(value)) {
            stateData.opened = false;
        }
        console.log(valueSelected)
        console.log(value)
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
                value: value
            })
        }
    }, [props.onChange, props.dataItem, props.level, props.field, state.value])
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
            />
        </td>
    );
};
export default React.memo(AssigneeDropDown)

