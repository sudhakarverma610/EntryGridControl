import { DatePicker, defaultDatePickerStrings, Dropdown, IDropdownOption, TextField } from "@fluentui/react";
import { useDispatch } from "react-redux";
import { IAppColumn } from "../../models/column";
import { FieldType } from "../../models/servicesModel/attributeReponseDto";
import { useState } from "react";
import './RenderControl.css';

export default function RenderControl(props:{col:IAppColumn,formSubmitted:boolean,fieldValue:any,error:any,
  onFormValueChange:any}) {
    const dispatch = useDispatch(); 
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]); 
 

    const onChange=(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string)=>{
        console.log('new Value',newValue);
        if(!newValue)
            newValue="";
        if(props.col.fieldName)
          {
          let fieldname=props.col.fieldName;
          var error=props.col.IsMandatory&&props.formSubmitted&&!newValue?"field is required":""

          props.onFormValueChange((values:any) => ({...values, [fieldname]: {value:newValue,error:error}}))
        } 
    }
    const onSelectDate=(date: Date | null | undefined)=>{
      if(date==null)
         date=undefined;
       if(props.col.fieldName){
        let fieldname=props.col.fieldName;
        let value=onFormatDate(date);
        var error=props.col.IsMandatory&&props.formSubmitted&&!value?"field is required":""
        props.onFormValueChange((values:any) => ({...values, [fieldname]: {value,error:error}}))

      }
    } 
    const onFormatDate = (date?: Date): string => {
      if(date?.getDate)
        return !date ? '' : date.getDate().toString().padStart(2, '0') + '.' + (date.getMonth() + 1).toString().padStart(2, '0') + '.' + (date.getFullYear());
      if(date)
      return date.toString();
      
      return "";
    };

    const onChangeSingDropDown = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
       console.log('option',option);
       if(props.col.fieldName&&option){
        let fieldname=props.col.fieldName;
        var newValue=option.text.toString();
        var error=props.col.IsMandatory&&props.formSubmitted&&!newValue?"field is required":""

        props.onFormValueChange((values:any)  => ({...values, [fieldname]: {value: newValue,error:error}}))
       }       
       
    };
    const onChangeMultiDropDown = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
      console.log('option',option);
      if (option) {
        let keys= option.selected ? [...selectedKeys, option.key as string] : selectedKeys.filter(key => key !== option.key);
        setSelectedKeys(keys);
        if(props.col.fieldName){
          let fieldname=props.col.fieldName;
          var newValue=keys.join(";");
          var error=props.col.IsMandatory&&props.formSubmitted&&!newValue?"field is required":"";
          props.onFormValueChange((values:any)  => ({...values, [fieldname]: {value: newValue,error:error}}));          
        }
         
        
      }
   } 
  return (    
       <>
        {(props.col.fieldName&&(props.col.data === FieldType.Text||props.col.data === FieldType.Number)) && (
                <TextField              
                label={props.col.name} key={props.col.fieldName} onChange={onChange}   
                 errorMessage={props.error}
                value={props.fieldValue}
                className={props.col.IsMandatory?"required":""}
                 />
            )}
            {(props.col.data === FieldType.DateOnly || props.col.data === FieldType.DateAndTime) && (
                <DatePicker                  
                ariaLabel="Select a date"
                label={props.col.name} 
                key={props.col.fieldName} 
                value={props.fieldValue} 
                onSelectDate={onSelectDate}
                formatDate={onFormatDate} 
                strings={defaultDatePickerStrings}
                isRequired={props.col.IsMandatory&&props.formSubmitted&&!props.fieldValue}
                className={props.col.IsMandatory?"required":""}
                 /> 
            )}
            {props.col.data === FieldType.TextArea && (
                <TextField label={props.col.name} key={props.col.fieldName} onChange={onChange} rows={5} 
                 required={props.col.IsMandatory}
                 errorMessage={props.error}
                 className={props.col.IsMandatory?"required":""}
                 value={props.fieldValue} 
                multiline />
            )}
            {props.col.data === FieldType.Dropdown && (
                <Dropdown
                    
                    label={props.col.name}
                    placeholder={`Select an ${props.col.name}`}
                    onChange={onChangeSingDropDown}
                    required={props.col.IsMandatory}
                    options={(props.col as any)?.ranges}
                    errorMessage={props.col.IsMandatory&&props.formSubmitted&&!props.fieldValue?"field is required":""}
                    defaultSelectedKey={props.fieldValue} 
                    className={props.col.IsMandatory?"required":""}
                />
            )}
             {props.col.data === FieldType.MultiSelectDropdown && (
                <Dropdown
                    label={props.col.name}
                    placeholder={`Select an ${props.col.name}`}
                    options={(props.col as any)?.ranges}
                    onChange={onChangeMultiDropDown}
                    required={props.col.IsMandatory}
                    errorMessage={props.error}
                     defaultSelectedKey={props.fieldValue} 
                    className={props.col.IsMandatory?"required":""}
                    multiSelect
                />
            )}
       </>
  );
  
}
