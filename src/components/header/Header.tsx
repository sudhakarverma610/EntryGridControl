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
      disabled:false,
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
     const [buttons,setButton] =useState<ButtonProps[]>(buttonWithoutEdit);
      useEffect(()=>{        
        console.log('isEditable change',isEditable);
        var formContext=(window as any)?.Xrm?.Page;
        let lrsaRef=formContext?.getAttribute('cm_lrsaid')?.getValue()?.[0];
        if(!lrsaRef){
           return;
        }
       var currentUserId =(window as any)?.Xrm?.Utility?.getGlobalContext()?.userSettings?.userId?.replace(/[{}]/g, '')?.toLowerCase();
        var template=formContext?.getAttribute("cm_istemplate")?.getValue();
        if(!template){
          props.service.retrieveRecord("cm_lrsa", lrsaRef?.id, "?$select=_cm_managerid_value").then(
              (vehicalRes)=>{
                  if(vehicalRes&&vehicalRes?._cm_managerid_value?.replace(/[{}]/g, '')?.toLowerCase()===currentUserId){
                    //enablebutton
                    setEnableButton(true);
                  }else
                    setEnableButton(false);
              },
              (err)=>{
                  console.log('error',err);
              }
          )
      }else {
          let isMemberOfTeam=(userId:string, teamId:string, callback:any)=> {
              const query = `?$filter=systemuserid eq ${userId} and teamid eq ${teamId}`;        
              props.service.retrieveMultipleRecords("teammembership", query).then(
                  (result) =>{
                      // Check if any records were returned
                      if (result.entities.length > 0) {
                          callback(true); // User is a member of the team
                      } else {
                          callback(false); // User is not a member of the team
                      }
                  },
                  (error) =>{
                      console.error("Error checking team membership: " + error.message);
                      callback(false); // Handle error case
                  }
              );
          }
          let checkUserPartOfTeam=()=>{
            props.service.retrieveMultipleRecords("cm_setting","?$filter=cm_name eq 'Secuirty_Team_Configuration'&$select=cm_value").then(it=>{
             let value= it.entities?.[0].cm_value;
             if(value){
              let teamId= JSON.parse(value)?.cm_dm_plan;
               //Project Team - test
                isMemberOfTeam(currentUserId,teamId,(isMember:boolean)=>{
                  if(isMember){
                    setEnableButton(true);
                  }else{
                    setEnableButton(false);
                  }
              })
             }
            })
          };
          checkUserPartOfTeam();        
          
      }
        if(isEditable){
          setButton([...buttonWithEdit])
        }else{
          setButton([...buttonWithoutEdit])
        }
       },
      [isEditable])    
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
         {enableButton&& listButtons}
      </Stack>;
  
}
