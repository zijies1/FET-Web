import React from 'react';
import BottomNav from '../commons/BottomNav';
import { Form, Icon, Input, Row ,Table, Button, Popconfirm, Modal, Col, Select,Tabs, Tooltip, Radio } from 'antd';
import { connect } from 'react-redux';
import { updateFieldTimetable, updateFieldActivities, onSendTimetable } from '../../actions';
import { createActivity, delObject, refreshActivities, serializeActivities, buildFilter } from '../../helper';

// TODO: may use common step
class Step5 extends React.Component {

  constructor(props) {
    super(props);
    // const { students, tags, teachers, subjects } = this.props.timetable;
    // let subjectFilters = buildFilter(subjects.data, "subject");
    // let tagFilters = buildFilter(tags.data, "tag");
    // let studentFilters = buildFilter(students.data, "students");
    // let teacherFilters = buildFilter(teachers.data, "teacher");
    this.columns = [
      {
        title: 'Key',
        dataIndex: 'key',
        key: 'key'
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration'
      },
      {
        title: 'Teachers',
        dataIndex: 'teachers',
        key: 'teachers',
        sorter: (a, b) => a.teachers > b.teachers
      },
      {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
        sorter: (a, b) => a.subject > b.subject
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
        sorter: (a, b) => a.tags > b.tags,
      },
      {
        title: 'Students',
        dataIndex: 'students',
        key: 'students',
        sorter: (a, b) => a.students > b.students,
      },
      {
        title: 'Active',
        dataIndex: 'active',
        key: 'active'
      }
    ];
  }

  goBack = () => this.props.updateFieldTimetable("step", this.props.step - 1);

  goNext = () => this.props.onSendTimetable(this.props.timetable);

  showModal = () => this.props.updateFieldTimetable("showModal", true);

  closeModal = () => this.props.updateFieldTimetable("showModal", false);

  statusOnChange = e => {
    let currentActivity = this.props.timetable.newActivity;
    this.props.updateFieldTimetable("newActivity", {...currentActivity, active:e.target.value});
  }

  subjectOnChange = val => {
    let currentActivity = this.props.timetable.newActivity;
    this.props.updateFieldTimetable("newActivity", {...currentActivity, selectedSubject:val});
  }

  splitOnChange = val => {
    let currentActivity = this.props.timetable.newActivity;
    let durations = {};
    [...Array(val).keys()].map(i => {
      durations["duration_" + (i+1).toString()] = 1;
    });
    this.props.updateFieldTimetable("newActivity",
       {
         ...currentActivity,
         split:val,
         durations
       }
    );
  }

  durationsOnChange = (val, key) => {
    let currentActivity = this.props.timetable.newActivity;
    this.props.updateFieldTimetable(
      "newActivity",
      {
        ...currentActivity,
        durations:{
          ...currentActivity.durations,
          ["duration_" + key.toString()]:val
        }
      }
    );
  }

  handleAdd = () => {
    this.props.updateFieldActivities("error", "");
    let { data, keyList } = this.props.timetable.activities;
    let { newActivity } = this.props.timetable;
    let dataMap = [
      {
        name:"selectedStudents",
        errorMsg:"ERROR: no students being selected"
      },
      {
        name:"selectedTags",
        errorMsg:"ERROR: no tags being selected"
      },
      {
        name:"selectedTeachers",
        errorMsg:"ERROR: no teacher being selected"
      }
    ];

    let errorMsg = "";
    let incompleteData = false;
    dataMap.map(child => {
      if(newActivity[child.name].length === 0) {
        errorMsg += child.errorMsg;
        errorMsg += ". ";
        incompleteData = true;
      }
    })

    if(incompleteData) {
      this.props.updateFieldActivities("error", errorMsg);
    } else if(!newActivity.selectedSubject) {
      this.props.updateFieldActivities("error", "ERROR: no subject being selected");
    } else {
      let updatedActivities = createActivity(newActivity, keyList );
      this.props.updateFieldActivities(
        "data",
        [...data,  updatedActivities]
      );
      this.props.updateFieldActivities(
        "keyList",
        keyList
      );
      this.closeModal();
    }
  }

  //TODO: need a better way
  handleDelAll = () => {
    const { selectedRowKeys, data, keyList } = this.props.timetable.activities;
    let newData = [...data];
    let newKeyList = [...keyList];
    selectedRowKeys.map(key => {
      newData = delObject(newData, key);
      newKeyList = newKeyList.filter(item => item !== key);
    });

    // let result = refreshActivities(newData);
    // newData = result["newData"];
    // let ommitedKeys = result["ommitedKeys"];
    //
    // ommitedKeys.map(key => {
    //   newKeyList = newKeyList.filter(item => item !== key);
    // });

    this.props.updateFieldActivities("data", newData);
    this.props.updateFieldActivities("keyList", newKeyList);
  }

  render() {
    const { students, tags, teachers, subjects, activities, numberOfPeriodsPerDay, days } = this.props.timetable;
    const { data, keyList, error } = this.props.timetable.activities;
    const { selectedSubject, split, durations, loading, active } = this.props.timetable.newActivity;
    const formItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 32 },
        sm: { span: 18 },
      },
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.props.updateFieldActivities("selectedRowKeys",selectedRowKeys);
      }
    };

    const tableData = [
      {
        key:1,
        data: students.data,
        columns:[
          {
            title: 'Students',
            dataIndex: 'students',
            key: 'students',
          }
        ],
        rowSelection: {
          onChange: (selectedRowKeys, selectedRows) => {
            let currentActivity = this.props.timetable.newActivity;
            this.props.updateFieldTimetable("newActivity", {...currentActivity, selectedStudents:selectedRows});
          }
        }
      },
      {
        key:2,
        data: teachers.data,
        columns:[
          {
            title: 'Teacher',
            dataIndex: 'teacher',
            key: 'teacher'
          }
        ],
        rowSelection: {
          onChange: (selectedRowKeys, selectedRows) => {
            let currentActivity = this.props.timetable.newActivity;
            this.props.updateFieldTimetable("newActivity", {...currentActivity, selectedTeachers:selectedRows});
          }
        }
      },
      {
        key:3,
        data: tags.data,
        columns:[
          {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
          },
        ],
        rowSelection: {
          onChange: (selectedRowKeys, selectedRows) => {
            let currentActivity = this.props.timetable.newActivity;
            this.props.updateFieldTimetable("newActivity", {...currentActivity, selectedTags:selectedRows});
          }
        }
      },
    ]

    return (
      <Row>
        <Modal
            title="Add students"
            visible={this.props.timetable.showModal}
            onOk={this.handleAdd}
            onCancel={this.closeModal}
            width="1000px"
          >
          <Row gutter= {24}>
            {tableData.map(item =>
              <Col span = {5} key={item.key} >
                <Table
                  defaultExpandAllRows={true}
                  size="small"
                  columns={item.columns}
                  dataSource={item.data}
                  pagination={{ pageSize: 50 }}
                  scroll={{ y: 240 }}
                  rowSelection={item.rowSelection}
                />
              </Col>
            )}
            <Col span = {9}>
              <Form {...formItemLayout}>
                <Form.Item label="Subject" >
                  <Select
                    size="small"
                    value={selectedSubject}
                    onChange={this.subjectOnChange}
                   >
                    {subjects.data.map(subject =>
                      <Select.Option value={subject.subject} key = {subject.key}>{subject.subject}</Select.Option>
                     )}
                  </Select>
                </Form.Item>
                <Form.Item
                  label= {
                    <span>
                      Split&nbsp;
                      <Tooltip title="What do you want others to call you?">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  <Select
                    size="small"
                    value={split}
                    onChange={this.splitOnChange}
                   >
                     {[...Array(days.length).keys()].map(i => (
                       <Select.Option value={i+1} key = {i+1}>{i+1}</Select.Option>
                     ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label= {
                    <span>
                      Detail&nbsp;
                      <Tooltip title="What do you want others to call you?">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  <Tabs defaultActiveKey="1" type="card">
                    {[...Array(split).keys()].map(i => (
                      <Tabs.TabPane tab={i+1} key={i+1}>
                        <Form.Item label= "Duration" {...formItemLayout}>
                          <Select
                            size="small"
                            value={durations["duration_" + (i+1).toString()]}
                            onChange={(e) => this.durationsOnChange(e,i+1)}
                           >
                             {[...Array(numberOfPeriodsPerDay).keys()].map(i => (
                               <Select.Option value={i+1} key = {i+1}>{i+1}</Select.Option>
                             ))}
                          </Select>
                        </Form.Item>
                      </Tabs.TabPane>
                    ))}
                  </Tabs>
                </Form.Item>
                <Form.Item label="Active" >
                  <Radio.Group
                    buttonStyle="solid"
                    defaultValue="true"
                    onChange ={this.statusOnChange}
                  >
                    <Radio.Button value="true">true</Radio.Button>
                    <Radio.Button value="false">false</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                {error?<p style={{"color":"red"}}>{error}</p>:null}
              </Form>
            </Col>
          </Row>
        </Modal>

        <Row className="mb-2">
          <Button onClick={this.showModal}>Add New</Button>
          <Popconfirm title="Sure to delete?" onConfirm={this.handleDelAll}>
            <Button  className="ml-3">Delete Selected</Button>
          </Popconfirm>
        </Row>

        <Table
          size="small"
          columns={this.columns}
          dataSource={serializeActivities(data)}
          rowSelection={rowSelection}
        />

        <BottomNav
          loading = {false}
          goBackButtonText = {'Back'}
          goNextButtonText = {'Generate'}
          goBack= {this.goBack}
          goNext= {this.goNext}
        />
      </Row>
    );
  }
}

const mapStateToProps = state => ({ timetable: state.listTimetables.newTimetable });


export default connect( mapStateToProps, { updateFieldTimetable, updateFieldActivities, onSendTimetable  } )(Step5);
