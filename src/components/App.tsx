import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { counterActions } from "../store/feature/counterSlice";
import Header from "./header/Header";
import GridView from "./gridView/GridView";
import { gridActions } from "../store/feature/gridSlice";
import { useEffect } from "react";
import { PCFWebAPI } from "../services/DataverseService";
import { deletRowsDmRecord, getDmRecord } from "../services/DMPlanService";
import { mapColumn, mapRows } from "../mappers/mapToColumn";
import AppRow from "./addRow/AddRow";
import { config } from "process";
import { Config, Environment } from "../config";
 
export default function App(props:{service:PCFWebAPI}) {
  const count = useSelector((state: RootState) => state.counter.value);
  const maxKeyNumber = useSelector((state: RootState) => state.grid.maxRowCount);
  const selectedRowId = useSelector((state: RootState) => state.grid.selectedRowId);
  const dialogClosed = useSelector((state: RootState) => state.grid.onClickOfNewRow);
  const formData = useSelector((state: RootState) => state.grid.addNewForm);
  const dispatch = useDispatch();  
  const platId="7c19a6d2-7f4d-ef11-accd-000d3ab866c9";
  const loadEntryToDMPlan=(id:string)=>{
    getDmRecord(props.service,id,true).then(it=>{
      console.log('action res',it);
      let columns=mapColumn(it.Header);
      dispatch(gridActions.setColumns(columns));      
      dispatch(gridActions.setRows(mapRows({columns:it.Header,rows:it.Attributes})));      
    })    
  }
  useEffect(()=>{
    console.log('formData',formData,dialogClosed)
  },[dialogClosed])
  const onClickMe = () => {
    dispatch(counterActions.increment());
  };
  const AddNewRow=()=>{
    let dataToCreate={
      "key": maxKeyNumber.toString(),
      "name": "Lorem ipsum.audio-"+maxKeyNumber,
      "fileType": "audio",
      "modifiedBy": "Dolor Sit",
      "dateModified": "4/6/2017",
      "dateModifiedValue": 1496544984102,
      "fileSize": "36 KB",
      "fileSizeRaw": 36
  }
     dispatch(gridActions.initialForm());
     dispatch(gridActions.addNewRow(true))
  }
  const onEditClick=()=>{
    dispatch(gridActions.setEditable())
  }
  const isGuid=(str:string|null)=> {
    if(!str)
      return false;
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return guidRegex.test(str);
}
const deleteButtonHandler=()=>{
  console.log('deleteButtonHandler',selectedRowId);
  var id=props.service.getContext()?.parameters?.DmPlanId?.raw;
  if(id&&selectedRowId)
    deletRowsDmRecord(props.service,id,[selectedRowId]).then(it=>{
    dispatch(gridActions.deleteRow(selectedRowId))
  },(err)=>{
    console.log('an error occure while deleting')
  })

}
const refreshButtonHandler=()=>{
  console.log('refreshButtonHandler');
  var id=props.service.getContext()?.parameters?.DmPlanId?.raw;
  if(id)
    loadEntryToDMPlan(id);
     

}
  useEffect(()=>{
    var id=props.service.getContext()?.parameters?.DmPlanId?.raw;
    console.log(id);
    if(isGuid(id)&&id)
      loadEntryToDMPlan(id);
  },[props.service.getContext()?.parameters?.DmPlanId?.raw])
  useEffect(()=>{
    if(Config.Environment== Environment.Local)
    props.service.retrieveMultipleRecords("account","?$top=1&$select=accountid").then(it=>{
      console.log('it',it)
    })
  },[]);

   return (
    <>
      <Header
        refreshButtonHandler={() => {refreshButtonHandler()}}
        saveButtonHandler={() => {}}
        deleteButtonHandler={() => deleteButtonHandler()}
        newButtonHandler={() => {AddNewRow()}}
        editButtonHandler={()=>{
          onEditClick()
        }}
        isControlDisabled={false}
        selectedCount={23}
      ></Header>
      { dialogClosed &&
        <AppRow service={props.service}/>
      }
      
      <GridView/>
    </>
  );
}
