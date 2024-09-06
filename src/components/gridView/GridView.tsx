import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode, 
  Selection, 
  mergeStyles
} from "@fluentui/react"; 
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { gridActions } from "../../store/feature/gridSlice";
import GridCell from "./GridCellRender";
const onFormatDate = (date?: Date): string => {
  return !date ? '' : date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear());
};
export default function GridView() { 
  const columns = useSelector((state: RootState) => state.grid.columns);
  const rows = useSelector((state: RootState) => state.grid.rows);
  const isEditingEnabled = useSelector((state: RootState) => state.grid.isEditingEnabled);
  const key = useSelector((state: RootState) => state.grid.selectedRowId);
  const dispatch = useDispatch();
  const stickyHeaderStyles = mergeStyles({
    selectors: {
      '.ms-DetailsHeader': {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        background: 'white', // Ensure background is set to avoid transparency
      },
    },
  });
  const selection = new Selection({
    onSelectionChanged: () => {
      const selectedItems = selection.getSelection();
      var key=selectedItems?.[0]?.key?.toString();
      console.log('selected k0ey',key)
       
       dispatch(gridActions.setSelectedRowId(key));       
      
    },
  });  
 
  const _renderItemColumn =useCallback((item: any, index: number | undefined, column: IColumn | undefined) => {    
    var ranges=(column as any)?.ranges;
    const  [selectedKeys,setSelectedKeys]=useState(ranges?.filter((it:any)=>it.key== (column?.fieldName?item[column.fieldName]:undefined))?.map((it:any)=>it.key))

     if(column?.fieldName){
      if(item.key==key&&isEditingEnabled){
        return <GridCell item={item} column={column as any}></GridCell>
        
      }
      return <div>{item[column?.fieldName]}</div>
    }
      
  },[isEditingEnabled])
  return (   
    <div className={stickyHeaderStyles} style={{overflow:'auto'}}>
      <DetailsList
        items={rows}
        columns={columns}
        setKey="set"
        selection={selection}
        selectionMode={SelectionMode.single}        
        layoutMode={DetailsListLayoutMode.justified}
        constrainMode={ConstrainMode.horizontalConstrained}
        onRenderItemColumn={_renderItemColumn}      
      ></DetailsList>
   
      </div>
   );
}
