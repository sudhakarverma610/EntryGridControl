import { CommandBarButton, IButtonStyles, IIconProps, Stack, TextField } from "@fluentui/react";
import { addIcon, commandBarButtonStyles, deleteIcon, refreshIcon, saveIcon } from "../../styles/ButtonStyles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { FormEvent, useEffect, useState } from "react";
import { gridActions } from "../../store/feature/gridSlice";
import { PCFWebAPI } from "../../services/DataverseService";

export interface IHeaderProps {
    refreshButtonHandler: () => void;
    newButtonHandler: () => void;
    editButtonHandler: () => void;
    deleteButtonHandler: () => void;
    saveButtonHandler: () => void;
    isControlDisabled: boolean;
    selectedCount: number;
    service:PCFWebAPI
  }
  
  type ButtonProps = {
    order: number,
    text: string,
    icon: IIconProps,
    disabled: boolean,
    onClick: () => void,
    styles?: IButtonStyles,
  }
export default function Header(props:IHeaderProps) {
   const isEditable=useSelector((it:RootState)=>it.grid.selectedRowId);
   const [enableButton,setEnableButton]=useState<boolean>(false);
   const dispatch=useDispatch()
   const buttonWithoutEdit: ButtonProps[] = [
    {
      order: 1,
      text: 'New',
      icon: addIcon,
      disabled:false,
      onClick: props.newButtonHandler,
    },
    {
      order: 2,
      text: 'Refresh',
      icon: refreshIcon,
      disabled: false,
      onClick: props.refreshButtonHandler,
    },
    
     
  
  ];
  const buttonWithEdit: ButtonProps[] = [
    {
      order: 1,
      text: 'New',
      icon: addIcon,
      disabled:false,
      onClick: props.newButtonHandler,
    },
    {
      order: 2,
      text: 'Edit',
      icon: addIcon,
      disabled:(isEditable&&isEditable.length>1)?true:false,
      onClick: props.editButtonHandler,
    },
    {
      order: 3,
      text: 'Refresh',
      icon: refreshIcon,
      disabled: false,
      onClick: props.refreshButtonHandler,
    },
    {
      order:4 ,
      text: 'Delete',
      icon: deleteIcon,
      disabled: false,
      onClick: props.deleteButtonHandler,
      styles: {
        root: { display: props.selectedCount > 0 ? 'flex' : 'none' },
        icon: { color: 'black' },
      },
    }
  ];
  const buttonRefresh: ButtonProps[] = [
    
    {
      order: 1,
      text: 'Refresh',
      icon: refreshIcon,
      disabled: false,
      onClick: props.refreshButtonHandler,
    },
    
  ]; 
  const [buttons,setButton] =useState<ButtonProps[]>(buttonWithoutEdit);
     useEffect(()=>{        
        console.log('isEditable change',isEditable);         
          taskPerform();
       },
      [isEditable])
      const taskPerform=(isEnabled=false)=>{
        var formContext=(window as any)?.Xrm?.Page;         
        var formType= formContext?.ui?.getFormType();       
        if(formType==3 || formType==4){//Ready Only
          setButtons(isEditable,isEnabled?true: enableButton);
          return;
        }   
        // var statuscode=formContext?.getAttribute("statuscode")?.getValue();
        // if(statuscode!=1){
        //   setButtons(isEditable,isEnabled?true: enableButton);
        //   return;
        // } 
        setButtons(isEditable,true);
      }; 
      useEffect(()=>{
        var userSettings=(window as any)?.Xrm?.Utility?.getGlobalContext()?.userSettings;
        var roles=userSettings?.roles?.get()?.map((it:any)=>it.name);        
        props.service.retrieveMultipleRecords("cm_setting","?$filter=cm_name eq 'System_Secuirty_Roles'&$select=cm_value")
        .then(it=>{
          let value= it.entities?.[0].cm_value;
          if(value){
            let config=JSON.parse(value);
            const checkRoles = config;
            const hasAnyRole = checkRoles.some((role:any) => roles.includes(role));
            if (hasAnyRole) 
                {
                   setButtons(isEditable,true);
                  return;
                }else{
                   taskPerform();
                }             
          }
        })
      },[])
      const setButtons =(isEditable:string[] | undefined,enabled:boolean)=>{
        if(enabled){
          if(isEditable&&isEditable?.length>0){
            setButton([...buttonWithEdit])
          }else{
            setButton([...buttonWithoutEdit])
          }
        }else{
          setButton(buttonRefresh);
        }
      }    
      const searchChange = (
        event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string
      ) => {
        console.log("newValue", newValue);
        dispatch(gridActions.searchChange(newValue || ""));

       };
      const listButtons = buttons.map(button =>
        <CommandBarButton
          key={button.order}
          disabled={button.disabled}
          iconProps={button.icon}
          styles={button.styles ?? commandBarButtonStyles}
          text={button.text}
          onClick={button.onClick}          
        />);
    
      return <Stack horizontal horizontalAlign="end">
        <Stack horizontal className="searchbtn">
        <TextField onChange={searchChange} placeholder="Search..." />        
        </Stack>
         {listButtons}
      </Stack>;
  
}
