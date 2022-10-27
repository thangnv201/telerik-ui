import React, {useEffect, useState} from 'react';
import {invoke} from '@forge/bridge';
import {TreeList, TreeListDraggableRow, mapTree, moveTreeItem, extendDataItem} from '@progress/kendo-react-treelist';
import employees from './data';
import issueData from "./fetchData";

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

function App() {
    let [data, setData] = useState([]);
    let [expanded, setExpanded] = useState([1, 3]);

    if(data.length === 0){
        issueData.then(value => {
            console.log(value)
            setData(value);
        })
    }
    const onRowDrop = event => {
        setData(moveTreeItem(data, event.dragged, event.draggedOver, subItemsField));
    };

    const onExpandChange = event => {
        setExpanded(event.value ? expanded.filter(id => id !== event.dataItem.id) : [...expanded, event.dataItem.id])
    };

    const addExpandField = dataArr => {
        // const expanded = expanded;
        return mapTree(dataArr, subItemsField, item => extendDataItem(item, subItemsField, {
            expanded: expanded.includes(item.id)
        }));
    };0
    return (
        <TreeList style={{
            maxHeight: '540px',
            overflow: 'auto',
            width: '100%'
        }} expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChange}
                  data={addExpandField(data)} columns={columns} onRowDrop={onRowDrop} row={TreeListDraggableRow}/>
    );
}

export default App;
