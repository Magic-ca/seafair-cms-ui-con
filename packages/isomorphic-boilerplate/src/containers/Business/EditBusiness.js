import React from "react";
import { Link,useHistory,useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {  useSelector } from 'react-redux';
import Button from "@iso/components/uielements/button";
import { Col, Row, Form, } from "antd";
import Input from "@iso/components/uielements/input";
import Tabs, { TabPane } from "@iso/components/uielements/tabs";
import LayoutWrapper from "@iso/components/utility/layoutWrapper";
import {Fieldset, Label,TableTabsStyle } from "./User.styles";
import UserPageWrapper from "./SingleUser.styles";
import { General,Location,AssignedAsset,Personal } from "./Tabviews/Tabviews";
import businessActions from '../../redux/business/actions';

const { updateData, getById, deleteData } = businessActions;
const rowStyle = {
  width: "100%",
  display: "flex",
  flexFlow: "row wrap",
};
const colStyle = {
  marginBottom: "16px",
};
const colSwitchStyle = {
  marginTop:"30px"
};
const gutter = 16;
function callback(key) {} 
export default function (props) {
  const dispatch = useDispatch();
  let history = useHistory();
  const { mybusiness, isSave} = useSelector((state) => state.Business);
  const { Id } = useParams();
  const [strName, setStrName] = React.useState('');
  const [strCode, setStrCode] = React.useState('');

  const [strPrimaryContact, setStrPrimaryContact] = React.useState('');
  const [strPhone, setStrPhone] = React.useState('');
  const [strPhone2, setStrPhone2] = React.useState('');
  const [strFax, setStrFax] = React.useState('');
  const [strPrimaryEmail,setStrPrimaryEmail]=React.useState('');
  const [strSecondaryEmail,setStrSecondaryEmail]=React.useState('');
  const [strNotes,setStrNotes]=React.useState('');
  const [strPrimaryCurrency,setStrPrimaryCurrency]=React.useState('');
  const [strWebSite,setStrWebSite]=React.useState('');
  const [strBusinessClassification,setStrBusinessClassification]=React.useState('');

  const [strAddress,setStrAddress]=React.useState('');   
  const [strCity,setStrCity]=React.useState('');   
  const [strProvince,setStrProvince]=React.useState('');   
  const [strPostalCode,setStrPostalCode]=React.useState('');   
  const [intCountryID,setIntCountryID]=React.useState('');   
  const [strTimezone,setStrTimezone]=React.useState('');


  const [businessId,setBusinessId]=React.useState(null);

   const onSave = () => {
    var sendData = {     
      'strName'    :strName,
      'strCode'    :strCode,
      'strPrimaryContact'    :strPrimaryContact,
      'strPhone'    :strPhone,
      'strPhone2'    :strPhone2,
      'strFax'    :strFax,
      'strPrimaryEmail'    :strPrimaryEmail,
      'strSecondaryEmail'    :strSecondaryEmail,
      'strNotes'    :strNotes,
      'strPrimaryCurrency'    :strPrimaryCurrency,
      'strWebSite'    :strWebSite,
      'strBusinessClassification':strBusinessClassification,
      'strAddress':strAddress,
      'strCity':strCity,
      'strProvince':strProvince,
      'strPostalCode':strPostalCode,
      'intCountryID':intCountryID,
      'strTimezone':strTimezone,   
    }   
    
     dispatch(updateData(sendData,businessId));
  };  

  React.useEffect(() => {
    dispatch(getById(Id));
  }, []);
  React.useEffect(() => { 
    
    if (Object.keys(mybusiness).length!=0){
      // console.log(business,'bussiness');
      setBusinessId(mybusiness._id);
      setStrName(mybusiness.strName);
      setStrCode(mybusiness.strCode);

      setStrPrimaryContact(mybusiness.strPrimaryContact);
      setStrPhone(mybusiness.strPhone);
      setStrPhone2(mybusiness.strPhone2);
      setStrFax(mybusiness.strFax);
      setStrWebSite(mybusiness.strWebSite);
      setStrBusinessClassification(mybusiness.strBusinessClassification);
      setStrPrimaryEmail(mybusiness.strPrimaryEmail);
      setStrSecondaryEmail(mybusiness.strSecondaryEmail);
      setStrPrimaryCurrency(mybusiness.strPrimaryCurrency);
      setStrNotes(mybusiness.strNotes);

      setStrAddress(mybusiness.strAddress);
      setStrCity(mybusiness.strCity);
      setStrProvince(mybusiness.strProvince);
      setStrPostalCode(mybusiness.strPostalCode);
      setIntCountryID(mybusiness.intCountryID);
      setStrTimezone(mybusiness.strTimezone);

    }
  }, [mybusiness]);
 
 const changeGeneralInf=(inf)=>{
    
    setStrPrimaryContact(inf.strPrimaryContact);
    setStrPhone(inf.strPhone);
    setStrPhone2(inf.strPhone2);
    setStrFax(inf.strFax);
    setStrWebSite(inf.strWebSite);
    setStrBusinessClassification(inf.strBusinessClassification);
    setStrPrimaryEmail(inf.strPrimaryEmail);
    setStrSecondaryEmail(inf.strSecondaryEmail);
    setStrPrimaryCurrency(inf.strPrimaryCurrency);
    setStrNotes(inf.strNotes);

 }
 const changeLocationInf=(inf)=>{
  setStrAddress(inf.strAddress);
  setStrCity(inf.strCity);
  setStrProvince(inf.strProvince);
  setStrPostalCode(inf.strPostalCode);
  setIntCountryID(inf.intCountryID);
  setStrTimezone(inf.strTimezone);

 }
  const onDelete=()=>{
    dispatch(deleteData(Id));
  }
  React.useEffect(() => {
    if (isSave)
      history.push(`/dashboard/business`);
  }, [isSave]);

  return (
    <LayoutWrapper>    
          <div className="PageHeader">           
              <Link to="/dashboard/business">             
                <Button color="primary">
                  <span>Back</span>
                </Button>
              </Link>
            <Button type="primary" onClick={onSave} className="saveBtn" style={{marginLeft:"10px",marginRight:"10px"}}>
              <span>Save</span>
            </Button>
            <Button type="danger" className="saveBtn" onClick={onDelete} >
              <span>Delete</span>
             </Button>
          </div>

          <TableTabsStyle className="isoLayoutContentAsset">
        <h4 style={{ marginBottom: "15px" }}>Business: </h4>      
          <UserPageWrapper className="editView">
            <div className="PageContent">
              <Row style={rowStyle} gutter={gutter} justify="start">
                <Col md={12} sm={12} xs={24} style={colStyle}>               
                  <Form>
                  <Fieldset>
                    <Label>Name</Label>                  
                      <Input
                       value={strName}
                        placeholder=""
                        onChange={(event) => {
                          setStrName(event.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                  </Fieldset>
                </Form>                 
                </Col> 
                <Col md={8} sm={8} xs={24} style={colStyle}>
                  <Form>
                    <Fieldset>
                      <Label>Code</Label>                  
                        <Input
                          value={strCode}
                          placeholder=""
                          onChange={(event) => {
                            setStrCode(event.target.value);
                          }}
                          style={{ width: "60%" }}
                        />
                    </Fieldset>
                  </Form>      
                </Col>
               
                </Row>
                </div>
                </UserPageWrapper>      
                <Tabs
                  defaultActiveKey="1"
                  className="isoTableDisplayTab"
                  onChange={callback}
                >
          <TabPane tab="General" key="1">
                <General              
                business={mybusiness}
                changeGeneralInf={changeGeneralInf}
                ></General>
          </TabPane>   
          <TabPane tab="Location" key="2">
            <Location
              business={mybusiness}
            changeLocationInf={changeLocationInf}
            ></Location>
           {/* <Groups
           selectedGroups={selectedGroups}
           pageState={"edit"}
           groupIds={arrayGroupIds}
           ></Groups> */}
          </TabPane>
          <TabPane tab="Associated Assets" key="3">
              <AssignedAsset
              businessId={businessId}
              pageState={"edit"}
              businessName={strName}
             
              ></AssignedAsset>
          </TabPane>
          <TabPane tab="Personal" key="4">
            <Personal
              businessId={businessId}
            ></Personal>
          </TabPane>
          </Tabs>
          </TableTabsStyle>   
    </LayoutWrapper>
  );
}
