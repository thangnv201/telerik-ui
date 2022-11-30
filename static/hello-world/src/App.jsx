import React, { useEffect, useRef, useState } from "react";
import { invoke } from "@forge/bridge";
import "./styles.css";
import {
  TreeList,
  TreeListDraggableRow,
  mapTree,
  moveTreeItem,
  extendDataItem,
  modifySubItems,
  removeItems,
  TreeListTextEditor,
  TreeListToolbar,
} from "@progress/kendo-react-treelist";
import issueData, { findChildByJql, getSingleIssue } from "./fetchData";
import updateIssueLink, { assigneeIssue, transitionIssue } from "./service";
import MyCommandCell from "./my-command-cell";
import { linkNewIssue, createIssue, updateIssue } from "./service";
import {
  DropDownButton,
  DropDownButtonItem,
} from "@progress/kendo-react-buttons";
import { issueType } from "./issueType";
import AssigneeDropDown from "./DropDown/AssigneeDropDown";
import TransitionDropDown from "./DropDown/TransitionDropDown";
import { StoryPointDropDown } from "./DropDown/StoryPointDropDown";
import LinkedIssueType from "./Filter/LinkedIssueTypeFilter";

import { Button } from "@progress/kendo-react-buttons";
import FilterData from "./Filter/FilterData";

const subItemsField = "issues";
const expandField = "expanded";
const editField = "inEdit";

function App() {
  let [data, setData] = useState([]);
  let [expanded, setExpanded] = useState([1, 2, 32]);
  let [inEdit, setInEdit] = useState([]);
  let bundleSave = useRef({});
  // if (data.length === 0) {
  //   issueData().then((value) => {
  //     setData(value);
  //   });
  // }

  const onRowDrop = (event) => {
    const dropItemIndex = [...event.draggedOver];
    const dropItem = getItemByIndex(data, dropItemIndex);
    const oldParentIndex = [...event.dragged].slice(0, -1);
    const oldParent = getItemByIndex(data, oldParentIndex);
    setData(
      moveTreeItem(data, event.dragged, event.draggedOver, subItemsField)
    );
    updateIssueLink(dropItem, oldParent, event.draggedItem);
  };
  const getItemByIndex = (data, draggedOver) => {
    if (draggedOver.length === 0) return null;
    if (draggedOver.length === 1) return data[draggedOver[0]];
    else {
      let childIndex = [...draggedOver];
      childIndex.shift();
      return getItemByIndex(data[draggedOver[0]].issues, childIndex);
    }
  };
  const onExpandChange = (event) => {
    console.log(event);
    if (event.value === false) {
      let issueParent = event.dataItem;
      Promise.all(
        issueParent.issues.map(async (child) => {
          let childOfChild = await findChildByJql(child);
          await loadChild(data, child.key, childOfChild);
        })
      ).then(() => {
        setData(data);
        setExpanded(
          event.value
            ? expanded.filter((id) => id !== event.dataItem.id)
            : [...expanded, event.dataItem.id]
        );
      });
    }
  };
  const loadChild = async (source, parentKey, childIssues) => {
    source.forEach((element) => {
      if (element.key === parentKey) {
        console.log(element);
        element.issues = childIssues;
        return source;
      }
      if (element.issues !== undefined) {
        loadChild(element.issues, parentKey, childIssues);
      }
    });
  };
  const addExpandField = (dataArr) => {
    return mapTree(dataArr, subItemsField, (item) =>
      extendDataItem(item, subItemsField, {
        [expandField]: expanded.includes(item.id),
        [editField]: Boolean(inEdit.find((i) => i.id === item.id)),
      })
    );
  };
  const addChild = (dataItem, issueTypeId) => {
    const newRecord = createNewItem();
    newRecord.parentKey = dataItem.key;
    newRecord.issueType = issueTypeId;
    setInEdit([...inEdit, newRecord]);
    setExpanded([...expanded, dataItem.id]);
    setData(
      modifySubItems(
        data,
        subItemsField,
        (item) => item.id === dataItem.id,
        (subItems) => [newRecord, ...subItems]
      )
    );
  };
  const enterEdit = (dataItem) => {
    setInEdit([...inEdit, extendDataItem(dataItem, subItemsField)]);
  };
  const save = (dataItem) => {
    const { isNew, ...itemToSave } = dataItem;

    console.log(dataItem);
    if (isNew === true) {
      let body = {
        fields: {
          summary: itemToSave.summary,
          project: {
            id: "10004",
          },
          issuetype: {
            id: itemToSave.issueType,
          },
          assignee: {
            id:
              itemToSave["assignee.displayName"] !== undefined
                ? itemToSave["assignee.displayName"].id
                : null,
          },
        },
      };
      if (itemToSave["assignee.displayName"] !== undefined) {
        itemToSave.assignee = {
          displayName: itemToSave["assignee.displayName"].text,
          accountId: itemToSave["assignee.displayName"].id,
        };
      }
      createIssue(JSON.stringify(body)).then((result) => {
        itemToSave.key = result.key;
        setData(
          mapTree(data, subItemsField, (item) =>
            item.id === itemToSave.id ? itemToSave : item
          )
        );
        if (dataItem.parentKey !== undefined) {
          linkNewIssue(result.key, dataItem.parentKey);
        }
      });
      setInEdit(inEdit.filter((i) => i.id !== itemToSave.id));
    } else {
      let body = {
        fields: {
          summary: itemToSave.summary,
          customfield_10033: itemToSave.storyPoint,
        },
      };

      console.log(itemToSave);
      if (itemToSave["status.text"] !== undefined) {
        itemToSave["status"].text = itemToSave["status.text"].text;
        transitionIssue(itemToSave.key, itemToSave["status.text"].id);
      }
      if (itemToSave["assignee.displayName"] !== undefined) {
        itemToSave.assignee = {
          displayName: itemToSave["assignee.displayName"].text,
          accountId: itemToSave["assignee.displayName"].id,
        };
        assigneeIssue(itemToSave.key, itemToSave["assignee.displayName"].id);
      }
      updateIssue(JSON.stringify(body), itemToSave.key).then((result) => {
        setData(
          mapTree(data, subItemsField, (item) =>
            item.id === itemToSave.id ? itemToSave : item
          )
        );
      });
      setInEdit(inEdit.filter((i) => i.id !== itemToSave.id));
    }
  };
  const cancel = (editedItem) => {
    if (editedItem.isNew) {
      return remove(editedItem);
    }
    setData(
      mapTree(data, subItemsField, (item) =>
        item.id === editedItem.id ? inEdit.find((i) => i.id === item.id) : item
      )
    );
    setInEdit(inEdit.filter((i) => i.id !== editedItem.id));
  };
  const remove = (dataItem) => {
    setData(removeItems(data, subItemsField, (i) => i.id === dataItem.id));
    setInEdit(inEdit.filter((i) => i.id !== dataItem.id));
  };
  const viewDetails = (dataItem) => {
    setData([dataItem]);
  };
  const onItemChange = (event) => {
    const field = event.field;
    setData(
      mapTree(data, subItemsField, (item) =>
        item.id === event.dataItem.id
          ? extendDataItem(item, subItemsField, {
              [field]: event.value,
            })
          : item
      )
    );
  };
  const addRecord = (issueTypeId) => {
    const newRecord = createNewItem();
    newRecord.issueType = issueTypeId;
    setData([newRecord, ...data]);
    setInEdit([...inEdit, { ...newRecord }]);
  };
  const saveAll = async () => {
    for (const element of inEdit) {
      await bundleSave.current[element.key].click();
    }
  };
  const reload = () => {
    issueData().then((value) => {
      setData(value);
      setIssueKey("");
    });
  };
  const createNewItem = () => {
    const timestamp = new Date().getTime();
    return {
      id: timestamp,
      isNew: true,
    };
  };
  const CommandCell = MyCommandCell(
    enterEdit,
    remove,
    save,
    cancel,
    addChild,
    editField,
    bundleSave,
    viewDetails
  );
  const columns = [
    {
      field: "key",
      title: "Key",
      expandable: true,
    },
    {
      field: "issueType",
      title: "Type",
    },
    {
      field: "summary",
      title: "Summary",
      editCell: TreeListTextEditor,
    },
    {
      field: "assignee.displayName",
      title: "assignee",
      editCell: AssigneeDropDown,
    },
    {
      field: "status.text",
      title: "status",
      editCell: (props) =>
        props.dataItem.isNew ? <td></td> : TransitionDropDown(props),
    },
    {
      field: "storyPoint",
      title: "storyPoint",
      editCell: (props) =>
        props.dataItem.issueType === "Story" ? (
          StoryPointDropDown(props)
        ) : (
          <td></td>
        ),
    },
    {
      cell: CommandCell,
    },
  ];
  let [issueKey, setIssueKey] = useState("");
  const getIssueKey = async () => {
    console.log(issueKey);
    if (issueKey.trim() === "") {
      alert("Please enter the issue key");
    }
    let issue = await getSingleIssue(issueKey);
    console.log(issue);
    if (issue !== null) {
      setData([issue]);
    } else {
      alert("Issue does not exist or you do not have permission to see it.");
    }
  };
  const onQuerry = (projects, linkType, issueKey) => {
    console.log(projects);
    console.log(linkType);
    console.log(issueKey);
    if (projects.length === 0) {
      alert("Please select at leas one project");
      return;
    }
    if (linkType === "") {
      alert("Please select link type of issue");
      return;
    }
    issueData(projects, linkType, issueKey).then((value) => {
      console.log(value);
      if (value.error) {
        alert(value.error);
      } else setData(value);
    });
  };
  return (
    <div>
      <FilterData onQuerry={onQuerry} />
      {data.length !== 0 && (
        <TreeList
          style={{
            maxHeight: "540px",
            overflow: "auto",
            width: "100%",
          }}
          expandField={expandField}
          editField={editField}
          subItemsField={subItemsField}
          onExpandChange={onExpandChange}
          onItemChange={onItemChange}
          data={addExpandField(data)}
          columns={columns}
          onRowDrop={onRowDrop}
          row={TreeListDraggableRow}
          resizable={true}
          toolbar={
            <TreeListToolbar>
              <DropDownButton
                themeColor="info"
                text={"Add new"}
                onItemClick={(event) => addRecord(event.item.id)}
              >
                {issueType.map((value) => (
                  <DropDownButtonItem
                    imageUrl={value.icon}
                    text={value.type}
                    id={value.id}
                  ></DropDownButtonItem>
                ))}
              </DropDownButton>
              <button
                title="Reload"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                onClick={reload}
              >
                Reload
              </button>
              {inEdit.length > 0 && (
                <button
                  title="Save All"
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                  onClick={saveAll}
                >
                  Save All
                </button>
              )}
            </TreeListToolbar>
          }
        />
      )}
    </div>
  );
}

export default App;
