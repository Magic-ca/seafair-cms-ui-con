import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom';
// import notification from '@iso/components/Notification';
import HelperText from '@iso/components/utility/helper-text';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';
import PageHeader from '@iso/components/utility/pageHeader';
import IntlMessages from '@iso/components/utility/intlMessages';
import Scrollbars from '@iso/components/utility/customScrollBar';
import Button from '@iso/components/uielements/button';
import Actions from '../../redux/usergroup/actions';
import CardWrapper, { Box } from './Asset.styles';
import TableWrapper from '@iso/containers/Tables/AntTables/AntTables.styles';
import clone from 'clone';
import fakeData from './data';

const dataList = new fakeData(10);

const { initData, deleteData } = Actions;

export default function UserGroup() {
  const [filtered, setFiltered] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 25,
  });

  const { usergroups, isDelete } = useSelector((state) => state.UserGroup);
  const dispatch = useDispatch();
  const match = useRouteMatch();
  React.useEffect(() => {
    dispatch(initData());
  }, []);

  React.useEffect(() => {
    setFiltered(usergroups);
  }, [usergroups]);

  React.useEffect(() => {
    if (isDelete) {
      dispatch(initData());
    }
  }, [isDelete]);

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'strFullName',
      key: 'strFullName',
      width: '55%',
      render: (text, row) => {
        return <a href={`/dashboard/usergroup/edit/${row._id}`}>{text}</a>;
      },
    },
    // {
    //   title: "",
    //   dataIndex: "strName1",
    //   rowKey: "strName1",
    //   width: "55%",
    // },
    // {
    //   title: "Action",
    //   dataIndex: "view",
    //   rowKey: "view",
    //   width: "15%",
    //   render: (text, usergroups) => (
    //     <div className="isoInvoiceBtnView">
    //       <Link to={`${match.path}/edit/${usergroups._id}`}>
    //         <Button color="primary" className="invoiceViewBtn">
    //           Edit
    //         </Button>
    //       </Link>{" "}
    //       <Button
    //         className="invoiceDltBtn"
    //         // icon="delete"
    //         onClick={() => {
    //           dispatch(deleteData([usergroups._id]));
    //         }}
    //       >
    //         <i className="ion-android-delete" />
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  const sortColumns = [{ ...columns[0], sorter: true }];

  const onChange = (pagination, filters, sorter) => {
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === 'ascend') {
        dataList.getSortAsc(sorter.columnKey, filtered);
      } else {
        dataList.getSortDesc(sorter.columnKey, filtered);
      }
      setFiltered(filtered);
    }
    setPagination(pagination);
  };

  return (
    <LayoutWrapper>
      <PageHeader>
        <IntlMessages id="sidebar.Groups" />
      </PageHeader>
      <Box>
        <div className="isoInvoiceTableBtn">
          <Link to={`${match.path}/add`}>
            <Button type="primary" className="mateAddInvoiceBtn">
              New
            </Button>
          </Link>
        </div>

        <CardWrapper title="Assets">
          {usergroups.length === 0 ? (
            <HelperText text="No Assets" />
          ) : (
            <div>
              <Scrollbars
                style={{ width: '100%', height: 'calc(100vh - 70px)' }}
              >
                <TableWrapper
                  // rowSelection={rowSelection}
                  dataSource={filtered}
                  columns={clone(sortColumns)}
                  onChange={onChange}
                  // pagination={true}
                  pagination={pagination}
                  className="isoSortingTable"
                />
              </Scrollbars>
            </div>
          )}
        </CardWrapper>
      </Box>
    </LayoutWrapper>
  );
}
