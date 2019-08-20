import React from 'react';
import BottomNav from './BottomNav';
import EditableTable from './EditableTable';
import { Form, Icon, Input, Row , Button, Popconfirm } from 'antd';
import { delObject, addObject, generateKey, updateObject, mapColumns } from '../../helper';

class CommonStep extends React.Component {

  // handleDelete = key => {
  //   const { data, keyList } = this.props;
  //   this.props.updateField("data", delObject(data, key));
  //   this.props.updateField("keyList", keyList.filter(item => item.key !== key));
  // }

  handleAdd = () => {
    const { data, keyList, objectPrototype } = this.props;
    let newKey = generateKey(keyList, data.length, 0);
    let newObject = {
      ...objectPrototype,
      key: newKey
    };

    this.props.updateField("data", [...data, newObject]);
    this.props.updateField("keyList", [...keyList, newKey]);
  };

  handleSave = row => {
    const { data } = this.props;
    this.props.updateField("data", updateObject(data, row.key, row));
  };

  render() {
    const { data, columns, rowSelection, goBack, goNext } = this.props;
    const columnsSource = mapColumns(columns);

    return (
      <Row>
        <Row className="mb-2">
          <Button onClick={this.handleAdd}>Add New</Button>
          <Button className="ml-3">Delete Selected</Button>
        </Row>
        <EditableTable
          columns={columnsSource}
          dataSource={data}
          rowSelection={rowSelection}
          handleSave={this.handleSave}
        />
        <BottomNav
          loading = {false}
          goBackButtonText = {'Back'}
          goNextButtonText = {'Next'}
          goBack= {goBack}
          goNext= {goNext}
        />
      </Row>
    );
  }
}

const mapStateToProps = state => ({ timetable: state.timetable });


export default CommonStep;