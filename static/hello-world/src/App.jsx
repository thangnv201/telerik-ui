import React, { useEffect, useState } from "react";
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
import issueData from "./fetchData";
import updateIssueLink from "./service";
import MyCommandCell from "./my-command-cell";
import createIssue from "./createIssue";
import {linkNewIssue} from "./service"

const subItemsField = "issues";
const expandField = "expanded";
const editField = "inEdit";
function App() {
  let [data, setData] = useState([]);
  let [expanded, setExpanded] = useState([1, 2, 32]);
  let [inEdit, setInEdit] = useState([]);
  if (data.length === 0) {
    issueData.then((value) => {
      console.log(value);
      setData(value);
    });
  }

  const onRowDrop = (event) => {
    const dropItemIndex = [...event.draggedOver];
    const dropItem = getItemByIndex(data, dropItemIndex);
    const oldParentIndex = [...event.dragged].slice(0, -1);
    const oldParent = getItemByIndex(data, oldParentIndex);
    console.log(dropItem);
    console.log(oldParent);
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
    setExpanded(
      event.value
        ? expanded.filter((id) => id !== event.dataItem.id)
        : [...expanded, event.dataItem.id]
    );
  };

  const addExpandField = (dataArr) => {
    return mapTree(dataArr, subItemsField, (item) =>
      extendDataItem(item, subItemsField, {
        [expandField]: expanded.includes(item.id),
        [editField]: Boolean(inEdit.find((i) => i.id === item.id)),
      })
    );
  };
  const addChild = (dataItem) => {
    const newRecord = createNewItem();
    console.log("add child");
    console.log(dataItem);
    newRecord.parentKey = dataItem.key;
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
    console.log(itemToSave);
    if (isNew === true) {
      let body = {
        fields: {
          summary: itemToSave.summary,
          project: {
            id: "10004",
          },
          issuetype: {
            id: "10005",
          },
        },
      };
      createIssue(JSON.stringify(body)).then((result) => {
        console.log(result);
        itemToSave.key = result.key;
        setData(
          mapTree(data, subItemsField, (item) =>
            item.id === itemToSave.id ? itemToSave : item
          )
        );
        setInEdit(inEdit.filter((i) => i.id !== itemToSave.id));
        if (dataItem.parentKey !== undefined) {
          linkNewIssue(result.key,dataItem.parentKey)
        }
      });
    } else {
      setData(
        mapTree(data, subItemsField, (item) =>
          item.id === itemToSave.id ? itemToSave : item
        )
      );
      setInEdit(inEdit.filter((i) => i.id !== itemToSave.id));
    }
    console.log("save");
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
  const addRecord = () => {
    console.log("add record");
    const newRecord = createNewItem();
    setData([newRecord, ...data]);
    setInEdit([...inEdit, { ...newRecord }]);
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
    editField
  );
  const columns = [
    {
      field: "key",
      title: "Key",
      width: "34%",
      expandable: true,
    },
    {
      field: "summary",
      title: "Summary",
      width: "33%",
      editCell: TreeListTextEditor,
    },
    {
      cell: CommandCell,
    },
  ];

  return (
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
      toolbar={
        <TreeListToolbar>
          <button
            title="Add new"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            onClick={addRecord}
          >
            Add new
          </button>
        </TreeListToolbar>
      }
    />
  );
}

export default App;
