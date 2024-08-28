import { CommandBarButton, IButtonStyles, IIconProps, Stack } from "@fluentui/react";
import { addIcon, commandBarButtonStyles, deleteIcon, refreshIcon, saveIcon } from "../../styles/ButtonStyles";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";

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
    
    {
      order: 4,
      text: 'Save',
      icon: saveIcon,
      disabled:false,
      onClick: props.saveButtonHandler,
      styles: {
        icon: { color: 'blue' },
        textContainer: { color: 'blue' },
      },
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
    },
    {
      order: 5,
      text: 'Save',
      icon: saveIcon,
      disabled:false,
      onClick: props.saveButtonHandler,
      styles: {
        icon: { color: 'blue' },
        textContainer: { color: 'blue' },
      },
    },
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
        {listButtons}
      </Stack>;
  
}
