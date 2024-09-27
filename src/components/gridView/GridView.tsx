import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
  Selection,
  mergeStyles
} from "@fluentui/react"; 
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { gridActions } from "../../store/feature/gridSlice";
import './gridStyles.css'; 

export default function GridView(props: { handleColumnClick: (ev: any, col: any) => void }) { 

  const columns = useSelector((state: RootState) => {
    const columnsWithClickHandler = state.grid.columns.map(column => ({
      ...column,
      onColumnClick: (ev: any, col: any) => handleColumnClick(ev, col),
    }));
    return columnsWithClickHandler;
  });

  const rows = useSelector((state: RootState) => state.grid.rows);
  const isEditingEnabled = useSelector((state: RootState) => state.grid.isEditingEnabled);
  const key = useSelector((state: RootState) => state.grid.selectedRowId);
  const onFormClosed = useSelector((state: RootState) => state.grid.onEditFormClosed);
  const dispatch = useDispatch();
  const selectionRef = useRef<Selection | null>(null);
 
  // Selection initialization, only done once
  if (!selectionRef.current) {
    selectionRef.current = new Selection({
      onSelectionChanged: () => {
        const selectedItems = selectionRef.current?.getSelection();
        const selectedKey = selectedItems?.[0]?.key?.toString();
        console.log('Selected key:', selectedKey);       
        dispatch(gridActions.setSelectedRowId(selectedKey)); // Store selected row in Redux
      },
    });
  }
  const handleColumnClick = (ev: any, col: any) => {  
    props.handleColumnClick(ev, col);
  }

  
   
  
  // Usage
  useEffect(() => {
    console.log('onFormClosed changed', key);    
    selectionRef?.current?.setAllSelected(false);
  }, [onFormClosed]);

  const _renderItemColumn = useCallback((item: any, index: number | undefined, column: IColumn | undefined) => {      
    if (column?.fieldName) {       
      return <div>{item?.[column.fieldName]}</div>;
    }
    return "";
  }, [isEditingEnabled]);
 
  return (
    <div className="details-list-container" style={{ height: '400px', overflowY: 'auto', position: 'relative' }}>
      <DetailsList       
        items={rows}
        columns={columns}
        setKey="set"
        selection={selectionRef.current}
        selectionMode={SelectionMode.single}        
        layoutMode={DetailsListLayoutMode.justified}
        constrainMode={ConstrainMode.unconstrained}
        onRenderItemColumn={_renderItemColumn}
        onShouldVirtualize={() => rows.length > 50}
        
      />

    </div>
  );
}
