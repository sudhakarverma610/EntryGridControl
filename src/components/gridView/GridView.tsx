import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
  Selection,
  TextField,
  Stack,
  IDetailsHeaderProps,
  IRenderFunction,
  IconButton,
} from "@fluentui/react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { gridActions } from "../../store/feature/gridSlice";
import "./gridStyles.css";
import FilterPanel from "./FilterPanel";
import { IAppColumn } from "../../models/column";
import { FieldType } from "../../models/servicesModel/attributeReponseDto";

export default function GridView(props: {
  handleColumnClick: (ev: any, col: any) => void;
}) {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Local state to hold the search query
  const searchQueryChange = useSelector((state: RootState) => state.grid.searchValue);

  const [filter, setFilter] = useState<any>();
  const [filters, setFilters] = useState<any[]>([]);
  const columns = useSelector((state: RootState) => {
    const columnsWithClickHandler = state.grid.columns.map((column) => ({
      ...column,
      onColumnClick: (ev: any, col: any) => handleColumnClick(ev, col),
    }));
    return columnsWithClickHandler;
  });
  const onlycolumns = useSelector((state: RootState) => {
    return state.grid.columns;
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
  useEffect(() => {
    setSearchQuery(searchQueryChange || ""); // Update the search query

  }, [searchQueryChange]);
  

  const _renderItemColumn = useCallback(
    (item: any, index: number | undefined, column: IColumn | undefined) => {
      if (column?.fieldName) {
        const fieldValue =  item[column.fieldName]?.toString() || "";
        const searchQueryLowerCase = searchQueryChange.toLowerCase();
        // Check if the cell's value matches the search query (case-insensitive)
        const isMatch =
          searchQueryLowerCase.length > 0
            ? fieldValue.toLowerCase().includes(searchQueryLowerCase)
            : false;

        return (
          <span
            style={{
              backgroundColor: isMatch ? "yellow" : "transparent", // Highlight if it's a match
              fontWeight: isMatch ? "bold" : "normal",
            }}
          >
          
            
            {column.data == FieldType.Url &&fieldValue.includes('http') && 
            <a href={fieldValue} target="_blank">{fieldValue}</a> }
             {column.data == FieldType.Url &&!fieldValue.includes('http') && 
              fieldValue}
            {column.data !== FieldType.Url&& fieldValue}
          </span>
        );
      }
      return null;
    },
    [searchQuery]
  );

  const doesRowContainSearchQuery = (row: any) => {
    const matchesSearchQuery = columns.some((col) => {
      const fieldValue = col.fieldName ? row[col.fieldName] : "";
      return fieldValue
        ?.toString()
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase());
    });
    let matchesFilter = true; // Default to true if no filter is applied
    filters.forEach(it=>{
      matchesFilter= matchesFilter&&  checkFilters(it,row)
    })
    
    // Return true if the row matches both the search query and the filter criteria
    return matchesSearchQuery && matchesFilter;
   };
  const checkFilters=(filter:any,row:any)=>{
    let matchesFilter = true;
    if (filter && filter.fieldName) {
      const column = columns.find(
        (col) => col.fieldName === filter.fieldName
      ) as IAppColumn;
      const fieldValue =
        column && column.fieldName
          ? row[column.fieldName]?.toString().toLowerCase()
          : "";
         // matchesFilter= checkFilterExist(column,fieldValue)
      switch (filter.filterOption) {
        case "dropdown":
          // eslint-disable-next-line no-case-declarations
          let values = filter.filterValue.split(",");
          // eslint-disable-next-line no-case-declarations
          let names: any[] = [];
          values.forEach((el: any) => {
            let name = column.Items.find((it) => it.Value?.toString() == el)
              ?.Name;
            if (name) names.push(name.toLowerCase());
          });
          if (fieldValue?.includes(";")) {
            const fieldValuesArray = fieldValue
              .split(";")
              .map((value: any) => value.trim().toLowerCase()); // Split by ';' and trim whitespaces
            matchesFilter = fieldValuesArray.some((value: any) =>
              names.includes(value)
            );
          } else matchesFilter = names.includes(fieldValue);
          // eslint-disable-next-line no-case-declarations
          //  matchesFilter=false//filters.lenght>0
          break; // fieldValue.split(',').includes()
        case "Equals":
          matchesFilter = fieldValue === filter.filterValue.toLowerCase();
          break;
        case "Contains":
          matchesFilter = fieldValue?.includes(
            filter?.filterValue?.toLowerCase()
          );
          break;
        case "StartsWith":
          matchesFilter = fieldValue.startsWith(
            filter.filterValue.toLowerCase()
          );
          break;
        case "EndsWith":
          matchesFilter = fieldValue.endsWith(filter.filterValue.toLowerCase());
          break;
        default:
          matchesFilter = true; // Default behavior if no valid filter is found
      }
    }
    return matchesFilter;
  } 
   
  const filteredRows = rows.filter((row) => doesRowContainSearchQuery(row)); 
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filterColumn, setFilterColumn] = useState<any>(null); // Store the column being filtered
  const [filterTarget, setFilterTarget] = useState<any>(null); // Store the target element for the Callout

  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
    props,
    defaultRender
  ) => {
    if (!props || !defaultRender) return null;
    const onFilterClick = (
      event: React.MouseEvent<HTMLElement>,
      column?: IColumn
    ) => {
      setFilterColumn(column);
      if (event.currentTarget) setFilterTarget(event.currentTarget); // Set the target for the Callout
      setIsFilterPanelOpen(true);
    };

    // Render the column headers with filter buttons
    return defaultRender({
      ...props,
      onRenderColumnHeaderTooltip: (tooltipHostProps) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {tooltipHostProps?.children}
          {tooltipHostProps?.column && (
            <IconButton
              iconProps={{
                iconName: (tooltipHostProps.column as any).filterValue
                  ? "FilterSolid"
                  : "Filter",
                style: { color: "grey" },
              }}
              title="Filter"
              ariaLabel="Filter"
              onClick={(e: any) => onFilterClick(e, tooltipHostProps.column)} // Open the inline filter panel for the clicked column
            />
          )}
        </div>
      ),
    });
  };
  const applyFilter = (filter: {
    filterOption: string;
    filterValue: string;
    fieldName: string;
  }) => {
    console.log("filter", filter);
    setFilter(filter);
    let filterFound = filters.find(it => it.fieldName === filter.fieldName);

    if (filterFound) {
      // Create a new copy of the filters array
      let newFilters = filters.map(it =>
        it.fieldName === filter.fieldName ? { ...filter } : it
      );
      
      setFilters(newFilters); // Update the state with the new filters array
    } else {
      // Create a new copy of the existing filters and add the new filter
      let newFilters = [...filters, { ...filter }];
      
      setFilters(newFilters); // Update the state with the new filters array
    }
    const updatedColumns = onlycolumns.map((col) => {
      if (col.fieldName === filter.fieldName) {
        return { ...col, filterValue: filter.filterValue }; // Update filterValue
      }
      return col;
    });
    dispatch(gridActions.setColumns(updatedColumns)); // Update the columns in Redux
    setIsFilterPanelOpen(false);
  };

  const clearFilter = (data:{fieldName: string}) => {
    const updatedColumns = onlycolumns.map((col) => {
      if (col.fieldName === data?.fieldName) {
        return { ...col, filterValue: undefined }; // Update filterValue
      }
      return col;
    });
    dispatch(gridActions.setColumns(updatedColumns));

    setFilter(null); // Reset the applied filter
    let filterIndex=filters.findIndex(it=>it.fieldName==data?.fieldName);
    if(filterIndex>-1)
     {
      let newFilters=[...filters]
      newFilters.splice(filterIndex, 1);
      setFilters(newFilters);
     }
    setIsFilterPanelOpen(false); // Close the panel after clearing the filter
  };
  const getFilterValue = () => {
    if (filter?.fieldName == filterColumn?.fieldName)
      return filter?.filterValue;
   let filterSaved= filters.find(it=>it.fieldName==filterColumn?.fieldName);
   if(filterSaved)
    return filterSaved?.filterValue;
    return undefined;
  };
  return (
    <div
      className="details-list-container"
      style={{ height: "400px", overflowY: "auto", position: "relative" }}
    >
    
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
          onRenderDetailsHeader={onRenderDetailsHeader} // Custom header rendering
        />
        {isFilterPanelOpen && (
          <FilterPanel
            isOpen={isFilterPanelOpen}
            column={filterColumn}
            value={getFilterValue()}
            onDismiss={() => setIsFilterPanelOpen(false)}
            onApplyFilter={applyFilter}
            onClearFilter={clearFilter}
            target={filterTarget} // Pass the clicked target element to position the panel
          />
        )} 
    </div>
  );
}
