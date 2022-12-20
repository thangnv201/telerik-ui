import { DateRangePicker } from "@progress/kendo-react-dateinputs";
import { useEffect, useState } from "react";
const DateRangeFilter = (props) => {
  let [show, setShow] = useState();
  let [value, setValue] = useState();
  useEffect(() => {
    if (props.value) {
      setValue({
        start: new Date(props.value.start),
        end: new Date(props.value.end),
      });
    }
  }, [props]);
  const handleChange = (event) => {
    console.log(event);
    setValue(event.value);
    console.log(event.value);
    if (event.value.start && event.value.end) {
      setShow(false);
    }
    props.onChangeDateRange(event.value);
  };
  const onForcus = (event) => {
    console.log(event);
    setShow(true);
  };
  return (
    <DateRangePicker
      onFocus={onForcus}
      value={value}
      onChange={handleChange}
      show={show}
    />
  );
};
export default DateRangeFilter;
