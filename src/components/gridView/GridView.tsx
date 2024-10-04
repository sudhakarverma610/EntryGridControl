import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
  Selection,
  TextField,
  Stack,
  DetailsRow,
  IDetailsHeaderProps,
  DetailsHeader,
} from "@fluentui/react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { gridActions } from "../../store/feature/gridSlice";
import "./gridStyles.css";

export default function GridView(props: {
  handleColumnClick: (ev: any, col: any) => void;
}) {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Local state to hold the search query

  const columns = useSelector((state: RootState) => {
    const columnsWithClickHandler = state.grid.columns.map((column) => ({
      ...column,
      onColumnClick: (ev: any, col: any) => handleColumnClick(ev, col),
    }));
    return columnsWithClickHandler;
  });

  const rows = useSelector((state: RootState) => state.grid.rows);
  const isEditingEnabled = useSelector(
    (state: RootState) => state.grid.isEditingEnabled
  );
  const key = useSelector((state: RootState) => state.grid.selectedRowId);
  const onFormClosed = useSelector(
    (state: RootState) => state.grid.onEditFormClosed
  );
  const dispatch = useDispatch();
  const selectionRef = useRef<Selection | null>(null);

  // Selection initialization, only done once
  if (!selectionRef.current) {
    selectionRef.current = new Selection({
      onSelectionChanged: () => {
        const selectedItems = selectionRef.current?.getSelection();
        const selectedKey = selectedItems?.[0]?.key?.toString();
        console.log("Selected key:", selectedKey);
        dispatch(gridActions.setSelectedRowId(selectedKey)); // Store selected row in Redux
      },
    });
  }
  const handleColumnClick = (ev: any, col: any) => {
    props.handleColumnClick(ev, col);
  };

  // Usage
  useEffect(() => {
    console.log("onFormClosed changed", key);
    selectionRef?.current?.setAllSelected(false);
  }, [onFormClosed]);

  // const _renderItemColumn = useCallback(
  //   (item: any, index: number | undefined, column: IColumn | undefined) => {






  //    // console.log('column',column)
  //     if (column?.fieldName) {
  //       return <div>{item?.[column.fieldName]} </div>;
  //     }
  //     return "";
  //   },
  //   [isEditingEnabled]
  // );
  const onRenderDetailsHeader = (
    props: IDetailsHeaderProps | undefined,
    defaultRender?: (props?: IDetailsHeaderProps) => JSX.Element | null
  ) => {
    if (!props) return null;
  
    // Customize header rendering
    return (
      <DetailsHeader
        {...props}        
      />
    );
  };
  const _renderItemColumn = useCallback(
    (item: any, index: number | undefined, column: IColumn | undefined) => {
      if (column?.fieldName) {
        const fieldValue = item[column.fieldName]?.toString() || "";
        const searchQueryLowerCase = searchQuery.toLowerCase();  
        // Check if the cell's value matches the search query (case-insensitive)
        const isMatch = searchQueryLowerCase.length>0? fieldValue.toLowerCase().includes(searchQueryLowerCase):false;  
        return (
          <span
            style={{
              backgroundColor: isMatch ? "yellow" : "transparent", // Highlight if it's a match
              fontWeight: isMatch ? "bold" : "normal",
            }}
          >
            {fieldValue}
          </span>
        );
      }
      return null;
    },
    [searchQuery]
  );
  
  const doesRowContainSearchQuery = (row: any) => {
    return columns.some((col) => {
      const fieldValue = col.fieldName ? row[col.fieldName] : "";
      return fieldValue
        ?.toString()
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase());
    });
  }
  const filteredRows = rows.filter((row) =>
    doesRowContainSearchQuery(row)
  );

  const searchChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    console.log("newValue", newValue);
    setSearchQuery(newValue || ""); // Update the search query

  };
  return (
    <div
      className="details-list-container"
      style={{ height: "400px", overflowY: "auto", position: "relative" }}
    >
      <Stack horizontal>
        <TextField
           
          onChange={searchChange}
          placeholder="Search..."
        />
      </Stack>

      <DetailsList
        items={filteredRows}
        columns={columns}
        setKey="set"
        selection={selectionRef.current}
        selectionMode={SelectionMode.single}
        layoutMode={DetailsListLayoutMode.justified}
        constrainMode={ConstrainMode.unconstrained}
        onRenderItemColumn={_renderItemColumn}
        onShouldVirtualize={() => filteredRows.length > 50}
        // onRenderRow={(props) => {
        //   if (!props) return null;
          
        //   const isHighlighted = doesRowContainSearchQuery(props.item);
          
        //   // Apply custom styles to the row if it's highlighted
        //   const customStyles = {
        //     root: {
        //       backgroundColor: isHighlighted ? "lightgreen" : "inherit",
        //     },
        //   };
      
        //   return <DetailsRow {...props} styles={customStyles} />;
        // }}
        onRenderDetailsHeader={onRenderDetailsHeader} // Custom header rendering

      />
    </div>
  );
}
