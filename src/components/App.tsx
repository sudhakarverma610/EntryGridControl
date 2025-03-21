import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import Header from "./header/Header";
import GridView from "./gridView/GridView";
import { gridActions } from "../store/feature/gridSlice";
import { useEffect, useState } from "react";
import { PCFWebAPI } from "../services/DataverseService";
import { deletRowsDmRecord, getDmRecord } from "../services/DMPlanService";
import { mapColumn, mapRows } from "../mappers/mapToColumn";
import AppRow from "./addRow/AddRow";
import { GridFooter } from "./gridView/GridFooter";
import EditRow from "./addRow/EditRow";
import { IColumn } from "@fluentui/react";
 
const PageSize=5;
export default function App(props:{service:PCFWebAPI}) {
  
  const selectedRowId = useSelector((state: RootState) => state.grid.selectedRowId);
  const dialogClosed = useSelector((state: RootState) => state.grid.onClickOfNewRow);
  const formData = useSelector((state: RootState) => state.grid.addNewForm);
  const selectedRow=useSelector((state: RootState) => state.grid.rows.find(it=>it.key==selectedRowId));
  const dispatch = useDispatch();  
  const [firstTime,setFirstTime]=useState(false);  
  const [currentColumns,setcurrentColumns]=useState([])
  const [currentPage,setCurrentPage]=useState(1);
  const [isMoreRecords,SetIsMoreRecord]=useState(false)
  const [dialogEditOpen,SetdialogEditOpen]=useState(false);
  const [dialogAddOpen,SetdialogAddOpen]=useState(false)

  const [editFormData,SeteditFormData]=useState<any>({})
  const [sortedColumnKey, setSortedColumnKey] = useState<string | undefined>(undefined);
  const [isSortedDescending, setIsSortedDescending] = useState<boolean>(false);

  // eslint-disable-next-line no-undef
  const handleColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn) => {
    const isSortedDescendingLocal = column.key === sortedColumnKey ? !isSortedDescending : false; 
    console.log('sort column field name',column.fieldName)
    console.log('sort column by',isSortedDescendingLocal)
    setSortedColumnKey(column.fieldName);
    if(column.isSortedDescending)
    setIsSortedDescending(column.isSortedDescending);
     if(column.fieldName)
       dispatch(gridActions.sortRows({field:column.fieldName,isSortedDescending:column.isSortedDescending}))
    
    };
  const loadEntryToDMPlan=(id:string,header:boolean,page:number,size:number)=>{
    var Xrm= (window as any).Xrm;
    Xrm?.Utility?.showProgressIndicator("Processing...") 
    getDmRecord(props.service,id,header,page,size,sortedColumnKey,isSortedDescending).then(it=>{
      console.log('action res',it);
      Xrm?.Utility?.closeProgressIndicator()
      if(it){
        var headers=currentColumns;
        if(it?.Header){
          setcurrentColumns(it.Header)
        }else{
          headers=it.Header;
        }
        let column:IColumn|undefined=undefined;
        if(header){
          let columns=mapColumn(it.Header,sortedColumnKey,isSortedDescending);   

          console.log('columns',columns);
          if(columns&&columns.length>0)
           column=  columns[0]
          dispatch(gridActions.setColumns(columns));
        }      
        dispatch(gridActions.setRows(mapRows({columns:it.Header,rows:it.Attributes})));  
        if(column)
        handleColumnClick(undefined as any,column);
        setFirstTime(true);    
        if(it?.PageMeta)
            SetIsMoreRecord(it?.PageMeta?.IsMoreRecords)
      }else{
        if(!firstTime)
        dispatch(gridActions.setColumns([]));      
        dispatch(gridActions.setRows([]));  
      }
      
    })    
  }
  useEffect(()=>{
    console.log('formData',formData,dialogClosed);

  },[dialogClosed])

  const AddNewRow=()=>{     
    SetdialogAddOpen(true)

     dispatch(gridActions.initialForm());
    //  dispatch(gridActions.addNewRow(true))
  }
  const onEditClick=()=>{
    SetdialogEditOpen(true)
    console.log('selectedRow',selectedRow)
    if(selectedRow){
      var formValue:any={};
      Object.keys(selectedRow).forEach(key=>{
        formValue[key]={value:selectedRow[key]?.toString(),error:''}
      })
      SeteditFormData(formValue)
    }
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
    deletRowsDmRecord(props.service,id,selectedRowId).then(()=>{
    dispatch(gridActions.deleteRow(selectedRowId));
    refreshButtonHandler();
  },()=>{
    console.log('an error occure while deleting')
  })

}
const refreshButtonHandler=()=>{
  console.log('refreshButtonHandler');
  var id=props.service.getContext()?.parameters?.DmPlanId?.raw;
  if(id)
    loadEntryToDMPlan(id,true,1,PageSize); 
}
  useEffect(()=>{
    var id=props.service.getContext()?.parameters?.DmPlanId?.raw;
    console.log(id);
    if(isGuid(id)&&id)
      loadEntryToDMPlan(id,true,1,PageSize);
  },[props.service.getContext()?.parameters?.DmPlanId?.raw])
  useEffect(()=>{
    //if(Config.Environment== Environment.Local)
    props.service.retrieveMultipleRecords("account","?$top=1&$select=accountid").then(it=>{
      console.log('it',it)
    })
  },[]);


  const onChangePage=(page:number)=>{
    setCurrentPage(page);
    var id=props.service.getContext()?.parameters?.DmPlanId?.raw;
    if(id)
      loadEntryToDMPlan(id,false,page,PageSize);
  }
 
   return (
    <div className="EntryGridContainer" style={{width:"calc(100% - 20px)"}}>
      <Header
        refreshButtonHandler={() => {refreshButtonHandler()}}
        saveButtonHandler={() => {}}
        deleteButtonHandler={() => deleteButtonHandler()}
        newButtonHandler={() => {AddNewRow()}}
        service={props.service}
        editButtonHandler={()=>{
          onEditClick()
        }}
        isControlDisabled={false}
        selectedCount={23}
      ></Header>
      { dialogAddOpen &&
        <AppRow service={props.service} close={()=>{SetdialogAddOpen(false)}}/>
      }   
      {dialogEditOpen &&
        <EditRow service={props.service} formValue={editFormData}  close={()=>{SetdialogEditOpen(false)}}/>
      }      
      <GridView  handleColumnClick={handleColumnClick}/>
      <GridFooter setCurrentPage={onChangePage} currentPage={currentPage} isLastPage={!isMoreRecords} />
    </div>
  );
}
