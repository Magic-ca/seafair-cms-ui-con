import React from 'react';
// import TableWrapper from '../AntTables.styles';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Form } from 'antd';
// import Scrollbars from "@iso/components/utility/customScrollBar";
import TableWrapper from '@iso/containers/Tables/AntTables/AntTables.styles';
// import addDoubleImg from '../../../assets/images/new-group-inner-list.png';
import Select, { SelectOption } from '@iso/components/uielements/select';
import Radio, { RadioGroup } from '@iso/components/uielements/radio';
import Button from '@iso/components/uielements/button';

import newAddImg from '../../../assets/images/new-inner-list.png';
import newUserImg from '../../../assets/images/new-with-user-inner-list.png';
import WorkOrderTaskModal from '../../../component/WorkOrderTaskModal';
import AddLaborToTaskModal from '../../../component/AddLaborToTaskModal';
import WorkOrderTaskAction from '../../../redux/workordertask/actions';
import { Label } from '../../Asset/Facility/OnlineContent.styles';
const Option = SelectOption;
const rowStyle = {
  width: '100%',
  display: 'flex',
  flexFlow: 'row wrap',
  // marginTop:"-20px",
  background: '#e0e7ed',
  // marginLeft:'2px'
  padding: '5px',
};
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
  marginBottom: '20px',
};
export default function (props) {
  const {
    workorderId,
    assetName,
    strAssetIds,
    strAssets,
    workorder,
    addWorkorderId,
  } = props;
  const gutter = 16;
  const dispatch = useDispatch();
  const [data, setData] = React.useState([]);
  const { getDatas, updateData, deleteData } = WorkOrderTaskAction;
  const [
    workOrderTaskModalActive,
    setWorkOrderTaskModalActive,
  ] = React.useState(false);
  const [
    addLaborToTaskModalActive,
    setAddLaborToTaskModalActive,
  ] = React.useState(false);
  const { workordertasks, isDelete } = useSelector(
    (state) => state.WorkOrderTask
  );
  const [pageState, setPageState] = React.useState('add');
  const [pageState2, setPageState2] = React.useState('add');
  const [workordertaskId, setWorkordertaskId] = React.useState(null);
  const [workOrderTaskTree, setWorkOrderTaskTree] = React.useState([]);
  const [assetId, setAssetId] = React.useState('All');
  const [strAssetName, setStrAssetName] = React.useState('');
  const [parentAssetId, setParentAssetId] = React.useState(null);
  const [assignedToUserName, setAssignedToUserName] = React.useState('');
  const [estimateTime, setEstimateTime] = React.useState();

  const columns = [
    {
      title: 'Description',
      dataIndex: 'strDescription',
      rowKey: 'strDescription',
      width: '30%',
      render: (text, row) => {
        return <a onClick={() => goDetail(row)}>{text}</a>;
      },
    },
    {
      title: 'Asset',
      dataIndex: 'intAssetID',
      rowKey: 'intAssetID',
      width: '10%',
      render: (val) => {
        return (
          <span>
            {val != null ? val.strName + ' (' + val.strCode + ')' : ''}
          </span>
        );
      },
    },
    {
      title: 'Assign To',
      dataIndex: 'intWorkOrderStatusID',
      rowKey: 'intWorkOrderStatusID',
      width: '10%',
      render: (text, row) => (
        <span>
          {row.intAssignedToUserID != null
            ? row.intAssignedToUserID.strFullName
            : ''}
        </span>
      ),
    },
    {
      title: 'Hrs Estimate',
      dataIndex: 'dblTimeEstimatedHours',
      rowKey: 'dblTimeEstimatedHours',
      width: '10%',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Hrs Spent',
      dataIndex: 'dblTimeSpentHours',
      rowKey: 'dblTimeSpentHours',
      width: '10%',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Result',
      dataIndex: 'strResult',
      rowKey: 'strResult',
      width: '10%',
      render: (text, row, index) => {
        let nextRow = workordertasks[index + 1];
        let nextRowId =
          nextRow != undefined ? nextRow.intParentWorkOrderTaskID : null;
        if (row.intTaskType == 3) {
          return (
            <RadioGroup
              onChange={(event) => onChangePassState(event, row)}
              name="value"
              value={row.strResult}
            >
              <Row gutter={gutter} justify="start">
                <Col md={12} sm={12} xs={24}>
                  <Radio style={radioStyle} value={'Pass'}>
                    Pass
                  </Radio>
                </Col>
                <Col md={12} sm={12} xs={24}>
                  <Radio style={radioStyle} value={'Fail'}>
                    Fail
                  </Radio>
                </Col>
              </Row>
            </RadioGroup>
          );
        } else if (row.intTaskType != 3 && nextRowId == row._id) {
          return (
            <RadioGroup
              onChange={(event) => onChangePassState(event, row)}
              name="value"
              value={'Pass'}
            >
              <Row gutter={gutter} justify="start">
                <Col md={12} sm={12} xs={24}>
                  <Radio style={radioStyle} value={'Pass'}>
                    Pass
                  </Radio>
                </Col>
                {/* <Col md={12} sm={12} xs={24} > 
                    <Radio  style={radioStyle} value={"Fail"} >
                        Fail
                    </Radio> 
                  </Col>                   */}
              </Row>
            </RadioGroup>
          );
        } else return <span>{text}</span>;
      },
    },
    {
      title: '',
      dataIndex: 'intWorkOrderStatusID',
      rowKey: 'intWorkOrderStatusID',
      width: '10%',
      render: (text, row) => {
        if (row.children == undefined) return <span></span>;
        else
          return (
            <a onClick={() => goAddLabor(row)}>
              <img
                style={{ width: '13px', height: '12px' }}
                src={newUserImg}
              ></img>
              <span>Add Labor</span>
            </a>
          );
      },
    },
    {
      title: '',
      dataIndex: 'delete',
      rowKey: 'delete',
      // width: "50%",
      render: (text, row) => {
        return (
          <Button
            onClick={() => {
              dispatch(deleteData(row._id));
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];
  const onChangePassState = (event, row) => {
    var sendData = {};
    sendData.intWorkOrderID = row.intWorkOrderID;
    sendData.intTaskType = row.intTaskType;
    sendData.dtmStartDate = row.dtmStartDate;
    sendData.dtmDateCompleted = row.dtmDateCompleted;
    sendData.intCompletedByUserID = row.intCompletedByUserID;
    sendData.intAssignedToUserID = row.intAssignedToUserID;
    sendData.dblTimeEstimatedHours = row.dblTimeEstimatedHours;
    sendData.dblTimeSpentHours = row.dblTimeSpentHours;
    sendData.intMeterReadingUnitID = row.intMeterReadingUnitID;
    sendData.strDescription = row.strDescription;
    sendData.strTaskNotesCompletion = row.strTaskNotesCompletion;
    sendData.intParentWorkOrderTaskID = 0;
    sendData.strResult = event.target.value;

    dispatch(updateData(sendData, row._id));
  };
  const handleCancel = () => {
    setWorkOrderTaskModalActive(false);
    setAddLaborToTaskModalActive(false);
  };
  const goDetail = (row) => {
    setPageState('edit');
    setPageState2('edit');
    setWorkordertaskId(row._id);
    if (row.children != undefined) {
      setWorkOrderTaskModalActive(true);
    } else {
      setAddLaborToTaskModalActive(true);
    }
  };
  const goAddLabor = (row) => {
    if (row.intAssignedToUserID === null) setAssignedToUserName('');
    else setAssignedToUserName(row.intAssignedToUserID.strFullName);

    setParentAssetId(row.intAssetID != null ? row.intAssetID._id : '');
    setWorkordertaskId(row._id);
    setAddLaborToTaskModalActive(true);
    setPageState2('add');
  };
  React.useEffect(() => {
    dispatch(getDatas(workorderId ? workorderId : addWorkorderId));
  }, []);
  React.useEffect(() => {
    if (isDelete)
      dispatch(getDatas(workorderId ? workorderId : addWorkorderId));
  }, [isDelete]);

  React.useEffect(() => {
    var temp_array = [];
    if (assetId == 'All') {
      temp_array = workordertasks;
    } else {
      workordertasks.map((row, index) => {
        var temp_assetId = '';
        temp_assetId =
          row.intAssetID != null ? row.intAssetID._id.toString() : '';
        if (temp_assetId == assetId) {
          temp_array.push(row);
        }
      });
    }
    var tree = makeTree(temp_array);
    setWorkOrderTaskTree(tree);
  }, [workordertasks, assetId]);

  React.useEffect(() => {
    setStrAssetName(assetName);
  }, [assetName]);
  const makeTree = (arr) => {
    var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;
    // First map the nodes of the array to an object -> create a hash table.
    for (var i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.key] = arrElem;
      mappedArr[arrElem.key]['children'] = [];
    }
    for (var id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.parentid) {
          delete mappedElem.children; //remove blank children
          mappedArr[mappedElem['parentid']]['children'].push(mappedElem);
        }
        // If the element is at the root level, add it to first level elements array.
        else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  };

  React.useEffect(() => {
    setEstimateTime(workorder ? workorder.intEstimatedHour : null);
  }, [workorder]);

  return (
    <div className="isoInvoiceTable">
      <Row style={rowStyle} gutter={16} justify="start">
        <Col md={4} sm={4} xs={24}>
          <Label style={{ padding: '5px 10px' }}>
            You Are Viewing Tasks For
          </Label>
        </Col>
        <Col md={6} sm={6} xs={24}>
          <Select
            defaultValue={'All'}
            style={{ width: '100%' }}
            onChange={(val, index) => {
              setAssetId(val);
              setStrAssetName(index.children);
            }}
          >
            <Option value="All">All</Option>
            {strAssetIds.map((row, index) => {
              return (
                <Option key={index} value={row}>
                  {strAssets[index]}
                </Option>
              );
            })}
          </Select>
        </Col>
      </Row>
      {/* <Scrollbars
        style={{ width: "100%", height: "calc(100vh - 70px)" }}
      > */}
      <TableWrapper
        // rowSelection={rowSelection}
        dataSource={workOrderTaskTree}
        columns={columns}
        pagination={false}
        pagination={{ pageSize: 10 }}
        className="invoiceListTable"
      />
      {/* </Scrollbars> */}
      <div
        style={{
          color: 'rgb(102, 115, 136)',
          fontSize: '10pt',
          background: '#f7f7f7',
          border: '1px solid rgb(241, 243, 246)',
          height: '25px',
        }}
      >
        <span
          style={{
            float: 'left',
            marginLeft: '4px',
            marginRight: '4px',
            cursor: 'pointer',
          }}
        >
          <img
            src={newAddImg}
            onClick={() => {
              setWorkOrderTaskModalActive(true);
              setPageState('add');
            }}
          ></img>
        </span>
        {/* <span style={{float: "left",
                    marginLeft:"4px", 
                    marginRight:"4px",
                    cursor:"pointer",
                   }}>
         <img src={addDoubleImg}></img></span> */}
      </div>
      <WorkOrderTaskModal
        visible={workOrderTaskModalActive}
        onCancel={handleCancel}
        title={'WORK ORDER TASK'}
        workorderId={workorderId}
        pageState={pageState}
        workordertaskId={workordertaskId}
        assetId={assetId}
        workorder={workorder}
        assetName={strAssetName == 'All' ? assetName : strAssetName}
        strAssetIds={strAssetIds.join(',')}
        addWorkorderId={addWorkorderId}
      ></WorkOrderTaskModal>
      <AddLaborToTaskModal
        visible={addLaborToTaskModalActive}
        onCancel={handleCancel}
        title={'ADD LABOR TO TASK'}
        pageState={pageState2}
        assetId={parentAssetId}
        workorderId={workorderId}
        parentWorkOrderTaskId={workordertaskId}
        workordertaskId={workordertaskId}
        assignedToUserName={assignedToUserName}
        estimateTime={estimateTime}
        addWorkorderId={addWorkorderId}
      ></AddLaborToTaskModal>
    </div>
  );
}
