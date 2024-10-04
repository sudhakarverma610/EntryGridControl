import { IColumn, IDropdownOption } from "@fluentui/react";
 
export const mapColumn=(headers:any[],sortedColumnKey:string|undefined,isSortedDescending:boolean
//  handleColumnClick: (ev: React.MouseEvent<HTMLElement>, column: IColumn) => void

)=>{    
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
                     // isSorted: false, 
                      data:it.DataType,
                      isPadded: true,

                    //  onColumnClick: (ev, column) => handleColumnClick(ev, column),
                      isSorted: sortedColumnKey === it.Name,  // Add sorting flag
                      isFiltered:true,
                      isSortedDescending: isSortedDescending,
                      ranges :it.Items?.map((it:any)=>{
                        return {key:it.Name,text:it.Name} as IDropdownOption
                      }),
                     
                    } as IColumn;
                    //console.log('IColumn',column)
                    return column;
    })     
  }
   
  export const mapRows=(data:{columns:any[], rows:any[]})=>{  
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