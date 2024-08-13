import { IColumn, IDropdownOption } from "@fluentui/react";
import { attributeReponse, FieldType, sampleDMPlan } from "../models/servicesModel/attributeReponseDto";

export const mapToColumn=(attribute:attributeReponse)=>{
  return  attribute.attribute.entities.map(it=>{
         let datatype="string"
      switch(it.cm_data_type){
        case 0://Text
            datatype="string";break;
        case 1://Text Area	
            datatype="string";break;
        case 2://Number	
            datatype="number";break;
        case 3://Dropdown
            datatype="dropdown";break;
        case 4://Multi Select Dropdown	
            datatype="dropdown";break;
        case 4://DateOnly
            datatype="date";break;
        case 4://DateAndTime	
            datatype="date";break;
      }     
       const column:IColumn={
            key: it.cm_attributeid,
            name: it.cm_name,
            fieldName: it.cm_internal_name,
            minWidth: 200,
            maxWidth: 200,
            isRowHeader: true,
            isResizable: true,
            isSorted: false, 
            data:datatype,
            isPadded: true,
            ranges :attribute.rangeItems.entities?.filter(rang=>rang._cm_rangeid_value== it._cm_rangeid_value)
          } as IColumn;
          console.log('IColumn',column)
          return column;
    });   
}
export const mapColumn=(headers:any[])=>{    
   return headers.map(it=>{
        const column:IColumn={
                    ...it,
                      key: it.Id,
                      name: it.DisplayName,
                      fieldName: it.Name,
                      minWidth: 200,
                      maxWidth: 200,
                      isRowHeader: true,
                      isResizable: true,
                      isSorted: false, 
                      data:it.DataType,
                      isPadded: true,
                      ranges :it.Items?.map((it:any)=>{
                        return {key:it.Name,text:it.Name} as IDropdownOption
                      }),
                     
                    } as IColumn;
                    //console.log('IColumn',column)
                    return column;
    })     
  }
   
  export const mapRows=(data:{columns:any[], rows:any[]})=>{  
   // console.log('mapper0')
    var allkeys=data.columns.map(it=>it.Name);
    return data.rows.map(row=>{
        var newRow:any={
            rowNo:row.rowNo,
            key:row.rowNo,
            isEditable:false,
        };
        allkeys.forEach(key=>{
            newRow[key]=row[key]
        });
        return newRow;
        
    })
  }