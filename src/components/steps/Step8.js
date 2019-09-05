import React from 'react';
import DraggableTimetable from '../commons/DraggableTimetable';
import { Radio, Select} from 'antd';
import { connect } from 'react-redux';
import { updateFieldTimetable, updateFieldSubjects } from '../../actions';

class Step1 extends React.Component {

  goStep7 = () => {this.props.updateFieldTimetable("step",7);};

  statusOnChange = e => {
    this.props.updateFieldTimetable("showGeneratedTimetable", e.target.value);
  };

  subGroupOnChange = val => {
    this.props.updateFieldTimetable("showSubgroupTimetable", val);
  };

  renderSubgroups = () => {
    const { subgroups } = this.props.timetable.finalTimetables;
    let subgroupsOrders = this.props.timetable.finalTimetablesOrders.subgroups;
    let subgroupNames = [];
    let timetableData = null;
    let timetableOrder = null;
    subgroups.map(subgroup => subgroupNames.push(subgroup.name));

    // first time showing
    if(!this.props.timetable.hasOwnProperty("showSubgroupTimetable")) {
      this.props.updateFieldTimetable("showSubgroupTimetable", subgroupNames[0]);
      timetableData = subgroups[0];
      timetableOrder = subgroupsOrders[subgroupNames[0]];
    } else {
      const { showSubgroupTimetable } = this.props.timetable;
      timetableData = subgroups[subgroupNames.indexOf(showSubgroupTimetable)];
      timetableOrder = subgroupsOrders[showSubgroupTimetable];
    }

    return(
      <div>
        <Select defaultValue={subgroupNames[0]} style={{ width: 200 }} onChange={this.subGroupOnChange}>
          {subgroupNames.map(name =>
            (<Select.Option key={name} value={name}>{name}</Select.Option>)
          )}
        </Select>
        <DraggableTimetable dataSource={timetableData} dataOrder={timetableOrder}/>
      </div>
    )
  }

  render() {
    // const typeData = ["activities","subgroups","teachers"];
    const typeData = ["subgroups","teachers"];
    const { showGeneratedTimetable } = this.props.timetable;
    console.log(this.props.timetable.finalTimetables)
    return (
      <div>
        {this.props.timetable["finalTimetables"]?
        <div>
          <Radio.Group
            buttonStyle="solid"
            defaultValue="activities"
            onChange ={this.statusOnChange}
          >
            {typeData.map(type =>
               (<Radio.Button key = {type} value= {type}>{type}</Radio.Button>)
            )}
          </Radio.Group>
          {showGeneratedTimetable === "subgroups"?
          this.renderSubgroups()
          :null}
        </div>
        : <div>no generated timetables yet!</div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({ timetable: state.listTimetables.newTimetable });


export default connect( mapStateToProps, { updateFieldTimetable, updateFieldSubjects } )(Step1);