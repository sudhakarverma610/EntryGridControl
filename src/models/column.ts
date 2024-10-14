import { IColumn } from "@fluentui/react";
import { FieldType } from "./servicesModel/attributeReponseDto";

 export interface IAppColumn extends IColumn{
    data:FieldType,
    IsMandatory:boolean;
    Items:any[]
}