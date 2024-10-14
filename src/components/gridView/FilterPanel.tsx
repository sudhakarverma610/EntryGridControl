import { FC, FormEvent, useState } from "react";
import {
  Callout,
  Dropdown,
  TextField,
  PrimaryButton,
  DefaultButton,
  IDropdownOption,
} from "@fluentui/react";
import { IAppColumn } from "../../models/column";
import { FieldType } from "../../models/servicesModel/attributeReponseDto";

interface FilterPanelProps {
  column: IAppColumn;
  isOpen: boolean;
  target: Element | null; // Target element for positioning
  value: string;
  onDismiss: () => void;
  onApplyFilter: (filter: {
    filterOption: string;
    filterValue: string;
    fieldName: string;
  }) => void;
  onClearFilter: () => void;
}

const FilterPanel: FC<FilterPanelProps> = ({
  column,
  isOpen,
  target,
  value,
  onDismiss,
  onApplyFilter,
  onClearFilter,
}) => {
  const [filterOption, setFilterOption] = useState<string>("Contains");
  const [filterValue, setFilterValue] = useState<string>(value);
  const [filterDropdownOption, setfilterDropdownOption] = useState<string[]>(
    value?.split(",")??[]
  );

  const filterOptions = (): IDropdownOption<any>[] => {
    if (
      column.data == FieldType.Text ||
      column.data === FieldType.TextArea ||
      column.data == FieldType.Number
    ) {
      return [{ key: "Contains", text: "Contains" }] as IDropdownOption[];
    }
    return [{ key: "Contains", text: "Contains" }] as IDropdownOption[];
  };
  const options = column.Items?.map((it: any) => {
    return { key: it.Value?.toString(), text: it.Name };
  });
  const handleApply = () => {
    let islist =
      column.data == FieldType.MultiSelectDropdown ||
      column.data == FieldType.Dropdown;
    if (islist)
      onApplyFilter({
        filterOption: "dropdown",
        filterValue: filterDropdownOption.join(),
        fieldName: column.fieldName ?? "",
      });
    else
      onApplyFilter({
        filterOption,
        filterValue,
        fieldName: column.fieldName ?? "",
      });
    onDismiss();
  };
  const onChange = (
    event: FormEvent<HTMLDivElement>,
    item: IDropdownOption | undefined
  ): void => {
    if (item) {
      let newItems = item.selected
        ? [...filterDropdownOption, item.key as string]
        : filterDropdownOption.filter((key) => key !== item.key);
      setfilterDropdownOption(newItems);
    }
  };
  const handleClear = () => {
    setFilterValue("");
    onClearFilter();
    onDismiss();
  };

  return isOpen && target ? (
    <Callout
      target={target} // Position the Callout near the target element
      onDismiss={onDismiss}
      setInitialFocus // Focuses the Callout automatically when it opens
    >
      <div className="filterContainer" style={{ padding: 15 }}>
        {column.data !== FieldType.MultiSelectDropdown &&
          column.data !== FieldType.Dropdown && (
            <Dropdown
              label="Filter type"
              options={filterOptions()}
              selectedKey={filterOption}
              onChange={(e, option) => setFilterOption(option?.key as string)}
            />
          )}

        {(column.data == FieldType.MultiSelectDropdown ||
          column.data == FieldType.Dropdown) &&
          column.Items?.length > 0 && (
            <Dropdown
              label="Select Options"
              selectedKeys={filterDropdownOption}
              onChange={(e, op) => onChange(e, op)}
              options={options}
              multiSelect
            />
          )}
        {column.data !== FieldType.MultiSelectDropdown &&
          column.data !== FieldType.Dropdown && (
            <TextField
              label="Value"
              value={filterValue}
              onChange={(e, newValue) => setFilterValue(newValue || "")}
            />
          )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
          }}
        >
          <PrimaryButton text="Apply" onClick={handleApply} />
          <DefaultButton text="Clear" onClick={handleClear} />
        </div>
      </div>
    </Callout>
  ) : null; // Render nothing if not open or no target
};

export default FilterPanel;
