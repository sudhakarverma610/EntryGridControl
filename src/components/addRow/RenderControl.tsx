import { DatePicker, defaultDatePickerStrings, Dropdown, IDropdownOption, TextField } from "@fluentui/react";
import { IAppColumn } from "../../models/column";
import { FieldType } from "../../models/servicesModel/attributeReponseDto";
import { FormEvent, useState } from "react";
import './RenderControl.css';

export default function RenderControl(props:{col:IAppColumn,formSubmitted:boolean,fieldValue:string,error:any,
  onFormValueChange:any}) {
    const [selectedKeys, setSelectedKeys] = useState<string[]>(props.col.data === FieldType.MultiSelectDropdown?props.fieldValue?.split(';'):[]); 
     const parseDate = (dateString: string) => {
      if (dateString) {
        const [day, month, year] = dateString.split("."); // Split the string by '.'
        const date = new Date(`${year}-${month}-${day}`);
        return date;
      }
      return undefined;
    };
    const getFormatedValue=(value:string)=>{
      
      var returnValue= value?.split(';');
      console.log('getFormatedValue',returnValue)
      return returnValue;
    }

    const onChange=(event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string)=>{
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

    const onChangeSingDropDown = (event: FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
       console.log('option',option);
       if(props.col.fieldName&&option){
        let fieldname=props.col.fieldName;
        var newValue=option.text.toString();
        var error=props.col.IsMandatory&&props.formSubmitted&&!newValue?"field is required":""

        props.onFormValueChange((values:any)  => ({...values, [fieldname]: {value: newValue,error:error}}))
       }       
       
    };
    const onChangeMultiDropDown = (event: FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
      console.log('option',option);
      if (option) {
        var newKeys;
        if(!selectedKeys){
          let keys= option.selected ? [[], option.key as string] : [].filter(key => key !== option.key);
          newKeys=(props.col as any).ranges.filter((it:any)=>keys.includes(it.key)).map((it:any)=>it.key)
          setSelectedKeys(newKeys);
        }else{
          let keys= option.selected ? [...selectedKeys, option.key as string] : selectedKeys.filter(key => key !== option.key);
          newKeys=(props.col as any).ranges.filter((it:any)=>keys.includes(it.key)).map((it:any)=>it.key)
          setSelectedKeys(newKeys);
        }
     
        if(props.col.fieldName){
          let fieldname=props.col.fieldName;
          var newValue=newKeys.join(";");
          var error=props.col.IsMandatory&&props.formSubmitted&&!newValue?"field is required":"";
          props.onFormValueChange((values:any)  => ({...values, [fieldname]: {value: newValue,error:error}}));          
        }
         
        
      }
   } 
  return (    
       <>
        {(props.col.fieldName&&(props.col.data === FieldType.Text||props.col.data === FieldType.Number||props.col.data === FieldType.Url)) && (
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
                value={parseDate(props.fieldValue)} 
                onSelectDate={onSelectDate}
                formatDate={onFormatDate} 
                strings={defaultDatePickerStrings}
                 className={props.col.IsMandatory?"required":""}
                 /> 
            )}
            {props.col.data === FieldType.TextArea && (
                <TextField label={props.col.name} key={props.col.fieldName} onChange={onChange} rows={5} 
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
                    defaultSelectedKeys={getFormatedValue(props.fieldValue)}  
                    options={(props.col as any)?.ranges}
                    onChange={onChangeMultiDropDown}
                     errorMessage={props.error}
                    className={props.col.IsMandatory?"required":""}
                    selectedKeys={selectedKeys}
                    multiSelect
                />
            )}
       </>
  );
  
}
