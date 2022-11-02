import * as React from 'react';
export default function MyCommandCell(enterEdit, remove, save, cancel, addChild, editField) {
  // eslint-disable-next-line react/display-name
  return class extends React.Component {
    render() {
      const {
        dataItem
      } = this.props;
      return dataItem[editField] ? <td>
                    <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={() => save(dataItem)}>
                      { <span class="k-icon k-i-check"></span>}
                    </button>
                    <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={() => cancel(dataItem)}><span class="k-icon k-i-cancel-outline"></span>
                    </button>
                  </td> : <td>
                    <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={() => addChild(dataItem)}>
                    <span class="k-icon k-i-plus"></span>
                    </button>
                    <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={() => enterEdit(dataItem)}>
                    <span class="k-icon k-i-edit"></span>
                    </button>
                    <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={() => remove(dataItem)}>
                    <span class="k-icon k-i-delete"></span>
                    </button>
                  </td>;
    }
  };
}