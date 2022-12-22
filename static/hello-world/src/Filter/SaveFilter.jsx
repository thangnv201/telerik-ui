import { useEffect, useState, useRef } from "react";
import { requestJira } from "@forge/bridge";
import { Popup } from "@progress/kendo-react-popup";
import { TextBox } from "@progress/kendo-react-inputs";
import { saveFilter } from "../service";

const SaveFilter = (props) => {
  const anchor = useRef();
  const [show, setShow] = useState(false);
  const [filterName, setFilterName] = useState("");
  const onClick = () => {
    setShow(!show);
  };
  const save = () => {
    if (filterName.trim().length === 0) {
      alert("Please enter filter name");
      return;
    }
    let data = {
      filterName: filterName,
      projects: props.options.projects,
      issueLinkType: props.options.issueLinkType,
      dateRange: props.options.dateRange,
      fixedVersions: props.options.fixedVersions
    };
    console.log(data)
    props.onSaveNewFilter(data)
    saveFilter(data);
    setShow(!show);
  };
  return (
    <>
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
        onClick={onClick}
        ref={anchor}
      >
        {show ? "Cancel" : "Save Filter"}
      </button>
      <Popup anchor={anchor.current} show={show} popupClass={"popup-content"}>
        <TextBox
          value={filterName}
          placeholder="Filter name"
          onChange={(e) => {
            setFilterName(e.value);
          }}
        ></TextBox>
        <button
          title="Search"
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
          onClick={save}
        >
          Save Filter
        </button>
      </Popup>
    </>
  );
};
export default SaveFilter;
