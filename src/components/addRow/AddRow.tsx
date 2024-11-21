import { DefaultButton, Panel, PanelType, PrimaryButton } from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useCallback, useEffect, useState } from "react";
import { useBoolean } from '@fluentui/react-hooks';
import { IAppColumn } from "../../models/column";
import  RenderControl from "./RenderControl";
import { gridActions } from "../../store/feature/gridSlice";
import { PCFWebAPI } from "../../services/DataverseService";
import { saveDmRecord } from "../../services/DMPlanService";

export default function AppRow(prop:{service:PCFWebAPI}) {
    const isAddEnabled = useSelector((state: RootState) => state.grid.onClickOfNewRow);
    const columns = useSelector((state: RootState) => state.grid.columns);
    const formValueSelector = useSelector((state: RootState) => state.grid.addNewForm);
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const [formSubmitted,setFormSubmitted] = useState(false);
    const [addRowForm, setAddRowForm] = useState<any>({});
    const dispatch = useDispatch();       
    useEffect(()=>{       
      if (isAddEnabled && !isOpen) {
        console.log("Opening panel");
        openPanel();
      } else if (!isAddEnabled && isOpen) {
        console.log("Closing panel");
        dismissPanel();
      }
    },[isAddEnabled, isOpen, openPanel, dismissPanel]);
    const onclose=()=>{
      dispatch(gridActions.addNewRow(false))
      dismissPanel();
 
    }
   ;
    const handleSubmit=(event:any)=>{    
      console.log('formValue',addRowForm);
      setFormSubmitted(true);
      event.preventDefault();
      const formElement = event.target;
      const isInValid = checkFormValidation();
      if(isInValid)
        return;
      let context=prop.service.getContext();
      var rowNumber=0;
      var dataToSent:any={};
      Object.keys(addRowForm).forEach(el=>{
        dataToSent[el]=addRowForm[el]?.value;
      })
      if(rowNumber==0){
        var dataToSentToServer={
          ...dataToSent,
                  };         
        console.log('data sending to Dataverse',dataToSentToServer);
        if(context.parameters.DmPlanId.raw)
         saveDmRecord(prop.service,context.parameters.DmPlanId.raw,[dataToSentToServer]).then(it=>{
            console.log('Row Added',it);
            //prop.service.updateRowNumber(rowNumber+1);
            dataToSentToServer.rowNo=it.Data;
            dataToSentToServer.key=it.Data;
            dispatch(gridActions.insertNewRow(dataToSentToServer));                
            dispatch(gridActions.addNewRow(false))
            dismissPanel(); 
            })  
      } 
     } 
   const   checkFormValidation=()=>{
    var newFormState={...addRowForm}

       columns.forEach(it=>{
        var col:IAppColumn=it as IAppColumn;
        if(col.fieldName&&col.IsMandatory){
          var fieldValue=newFormState[col.fieldName];
          if(fieldValue&&!fieldValue.value){
            newFormState[col.fieldName].error="field is required"
          }else if(fieldValue&&fieldValue.value)
            newFormState[col.fieldName].error=""
            else
            newFormState[col.fieldName]={value:"", error:"field is required"}
        } 
       });
       setAddRowForm(newFormState);
       return Object.keys(newFormState).filter(key=>newFormState[key]?.error).length>0;
      }
    const onRenderFooterContent = useCallback(
        () => (
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <PrimaryButton type="submit"
            form='my-form'>
              Save
            </PrimaryButton>
            <DefaultButton onClick={()=>onclose()}>Cancel</DefaultButton>
          </div>
        ),
        [dismissPanel],
      ); 
      
  return (
    <div>      
     
      <Panel
        isOpen={isOpen}
        onDismiss={onclose}
        headerText="Add new Entry"
        closeButtonAriaLabel="Close"
        onRenderFooterContent={onRenderFooterContent}         
        isFooterAtBottom={true}
        hasCloseButton={false}
        isBlocking={true}
        type={PanelType.medium}
      > <form onSubmit={handleSubmit} id="my-form">
      
          {columns.map((col:any)=>{
            return (                           
               <RenderControl col={col} key={col.fieldName} 
                formSubmitted={formSubmitted} 
                fieldValue={addRowForm[col.fieldName]?.value}  
                error={addRowForm[col.fieldName]?.error}              
                onFormValueChange={setAddRowForm}               
               />              
            )
          })} 
           </form>
      </Panel>
     
    </div>
  );  
}
