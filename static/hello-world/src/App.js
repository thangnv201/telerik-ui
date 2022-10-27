import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import { TreeList, TreeListDraggableRow, mapTree, moveTreeItem, extendDataItem } from '@progress/kendo-react-treelist';
import issueData from "./fetchData";
import updateIssueLink from './service';

const subItemsField = 'issues';
const expandField = 'expanded';
const columns = [{
    field: 'key',
    title: 'Key',
    width: '34%',
    expandable: true
}, {
    field: 'summary',
    title: 'Summary',
    width: '33%'
}];
// const toolbar =
//     <TreeListToolbar>
//         <div onClick={closeEdit}>
//             <button
//                 title="Add new"
//                 className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
//                 onClick={addRecord}
//             >
//                 Add new
//             </button>
//         </div>
//     </TreeListToolbar>
function App() {
    let [data, setData] = useState([]);
    let [expanded, setExpanded] = useState([1, 3]);

    if (data.length === 0) {
        issueData.then(value => {
            console.log(value)
            setData(value);
        })
    }
    const onRowDrop = event => {
        const dropItemIndex = [...event.draggedOver];
        const dropItem = getItemByIndex(data, dropItemIndex);
        const oldParentIndex=[...event.dragged].slice(0,-1);
        const oldParent = getItemByIndex(data,oldParentIndex);
        console.log(dropItem);
        console.log(oldParent);
        setData(moveTreeItem(data, event.dragged, event.draggedOver, subItemsField));
        updateIssueLink(dropItem,oldParent,event.draggedItem);
    };
    const getItemByIndex = (data, draggedOver) => {
        if (draggedOver.length === 0) return null;
        if (draggedOver.length === 1) return data[draggedOver[0]]
        else {
            let childIndex = [...draggedOver];
            childIndex.shift();
            return getItemByIndex(data[draggedOver[0]].issues, childIndex)
        }
    }
    const onExpandChange = event => {
        setExpanded(event.value ? expanded.filter(id => id !== event.dataItem.id) : [...expanded, event.dataItem.id])
    };

    const addExpandField = dataArr => {
        // const expanded = expanded;
        return mapTree(dataArr, subItemsField, item => extendDataItem(item, subItemsField, {
            expanded: expanded.includes(item.id)
        }));
    }; 0
    return (
        <TreeList style={{
            maxHeight: '540px',
            overflow: 'auto',
            width: '100%'
        }} expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChange}
            data={addExpandField(data)} columns={columns} onRowDrop={onRowDrop} row={TreeListDraggableRow} />
    );
}

export default App;
