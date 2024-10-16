import { CommandBarButton, IButtonStyles, IIconProps, Stack, TextField } from "@fluentui/react";
import { addIcon, commandBarButtonStyles, deleteIcon, refreshIcon, saveIcon } from "../../styles/ButtonStyles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { FormEvent, useEffect, useState } from "react";
import { gridActions } from "../../store/feature/gridSlice";

export interface IHeaderProps {
    refreshButtonHandler: () => void;
    newButtonHandler: () => void;
    editButtonHandler: () => void;
    deleteButtonHandler: () => void;
    saveButtonHandler: () => void;
    isControlDisabled: boolean;
    selectedCount: number;
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
        console.log('isEditable change',isEditable)
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
         {listButtons}
      </Stack>;
  
}
