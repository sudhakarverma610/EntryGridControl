import { IColumn } from "@fluentui/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface KeyValue {
  [key: string]: any;
}
type rowSliceType={
    rows:any[],
    maxRowCount:number,
    isEditRow:boolean,
    isEditingEnabled:number|undefined,
    selectedRowId:string|undefined,
    columns:IColumn[],
    onClickOfNewRow:false,
    addNewForm:KeyValue;
    onEditFormClosed:any

}
var initialState:rowSliceType={
    columns:[],
    rows:[],
    maxRowCount:0,
    isEditRow:false,
    isEditingEnabled:undefined,
    selectedRowId:undefined,
    onClickOfNewRow:false,
    addNewForm:{},
    onEditFormClosed:null
};
const generateUniqueValue=()=> {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

  // Concatenate all parts into a unique value
  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
}
export const gridSlice = createSlice({
    name: 'gridSlice',
    initialState: initialState,
    reducers: {
      setColumns: (state,action:PayloadAction<IColumn[]>) => {               
        state.columns=action.payload;
       },
      setRows: (state,action:PayloadAction<any[]>) => {               
        state.rows=action.payload;
        console.log('setRows',action.payload)
        state.maxRowCount=Math.max(...action.payload.map(it=>+it.key)) + 1;
      },
      insertNewRow: (state,action:PayloadAction<any>) => {     
        if(!state.rows)
          state.rows=[];
        state.rows.splice(0,0,action.payload)
        console.log('setRows',action.payload)
        state.maxRowCount=Math.max(...state.rows.map(it=>+it.key)) + 1;
      },
      updateRow: (state,action:PayloadAction<any>) => {     
        if(!state.rows)
          state.rows=[];
        var currentRow=state.rows.find(it=>it.key==action.payload.key);
        if(currentRow){
          state.onEditFormClosed=generateUniqueValue();
          Object.keys(currentRow).forEach(key=>{
            currentRow[key]=action.payload[key]
          })
        } 
      },
      deleteRow: (state,action:PayloadAction<any>) => {  
        state.rows=state.rows.filter(it=>it.rowNo!==action.payload)
        state.maxRowCount=Math.max(...state.rows.map(it=>+it.key)) + 1;
      },
      initialForm:(state)=>{
        state.addNewForm={};
      },
      addNewRow: (state, action: PayloadAction<any>) => {       
                state.onClickOfNewRow=action.payload
      },
      patchvalue:(state, action: PayloadAction<{key:string,value:any}>)=>{
        state.addNewForm[action.payload.key]=action.payload.value;
      }, 
      setEditable:(state) =>{
         var key=state.selectedRowId;
         if(!key)
          return;
         var newRows= Array.from(state.rows);
         newRows.filter(it=>it.isEditable).forEach(it=>{
          it.isEditable=false;
         });
        var currentRow= newRows.find(it=>it.key===key);
        if(currentRow)
          currentRow.isEditable=true;
         state.rows=newRows;   
         if(state.isEditingEnabled)
          state.isEditingEnabled=state.isEditingEnabled+1;  
         else 
          state.isEditingEnabled=1;    
      },
      setEnableFlag:(state, action: PayloadAction<number|undefined>) =>{
        state.isEditingEnabled=action.payload;
     },
     setSelectedRowId:(state, action: PayloadAction<string|undefined>) =>{
      state.selectedRowId=action.payload;
      if(!state.selectedRowId)
         state.isEditingEnabled=undefined;
     },
     sortRows: (state, action: PayloadAction<{ field: string, isSortedDescending:boolean |undefined}>) => {
      const { field, isSortedDescending } = action.payload;
      state.rows = [...state.rows].sort((a, b) => {
        if (!isSortedDescending) {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }

      });
      if (field) {
        // Reset sorting metadata for all columns
        state.columns.forEach(col => {
          col.isSorted = false;
          col.isSortedDescending = undefined;
        });

        // Find the column being sorted and set its sorting state
        const sortableColumn = state.columns.find(col => col.fieldName === field);
        if (sortableColumn) {
          sortableColumn.isSorted = true;
          sortableColumn.isSortedDescending = !isSortedDescending;
        }
      }
    }
  

    },
})
  export const gridActions = gridSlice.actions;
  export default  gridSlice.reducer
