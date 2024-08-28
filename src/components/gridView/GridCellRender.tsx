import { DatePicker, Dropdown, IColumn, TextField } from "@fluentui/react";
import { useState } from "react";
import { IAppColumn } from "../../models/column";
import { FieldType } from "../../models/servicesModel/attributeReponseDto";

export default function GridCell(props: { item: any; column: IAppColumn }) {
  const [column, setColumn] = useState(props.column);
  const [item, setItem] = useState<any>(props.item);

  var ranges = (column as any)?.ranges;
  const [selectedKeys, setSelectedKeys] = useState(
    ranges
      ?.filter(
        (it: any) =>
          it.key == (column?.fieldName ? item[column.fieldName] : undefined)
      )
      ?.map((it: any) => it.key)
  );
  const defaultValue = (): string => {
    if (column?.fieldName) {
      return item[column.fieldName];
    }
    return "";
  };
  const parseDate = (dateString: string) => {
    if (dateString) {
      const [day, month, year] = dateString.split("."); // Split the string by '.'
      const date = new Date(`${year}-${month}-${day}`);
      return date;
    }
    return undefined;
  };
  const onFormatDate = (date?: Date): string => {
    return !date
      ? ""
      : date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  };
  const onChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    console.log("new Value", newValue);
    if (!newValue) newValue = "";
    if (column.fieldName) {
      let fieldname = column.fieldName;
      item[fieldname] = newValue;
    }
  };
  return (
    <>
      {(column.data == FieldType.Text ||
        column.data === FieldType.TextArea ||
        column.data == FieldType.Number) && (
        <TextField defaultValue={defaultValue()} onChange={onChange} />
      )}

      {column.data == FieldType.DateOnly && (
        <DatePicker
          formatDate={onFormatDate}
          value={parseDate(defaultValue())}
        />
      )}
      {column.data == FieldType.Dropdown && (
        <Dropdown
          placeholder="Select an option"
          options={ranges}
          selectedKey={selectedKeys}
          defaultValue={defaultValue()}
          onChange={(e, item) => {
            setSelectedKeys([item?.key]);
          }}
        />
      )}
    </>
  );
}
