import { attributeReponse } from "../models/servicesModel/attributeReponseDto";
import { PCFWebAPI } from "./DataverseService";

export const getAttributes = async (
  service: PCFWebAPI,
  ciType: string
): Promise<attributeReponse> => {
  var response: attributeReponse = {} as attributeReponse;
  var allAttributes = await service.retrieveMultipleRecords(
    "cm_attribute",
    `?$filter=_cm_ci_typeid_value eq '${ciType}' and statuscode eq 1`
  );
  response.attribute = allAttributes;
  var allRanges = new Set(
    allAttributes.entities.map((it) => it["_cm_rangeid_value"])
  );
  if (allRanges.size > 0) {
    let rangeArr = Array.from(allRanges).filter(it=>it);
    let mappedString = rangeArr
      .map((value) => `<value>${value}</value>`)
      .join("");
    var fetchxmlForRange = `<fetch>
                                <entity name="cm_range_item">
                                    <attribute name="statecode" />
                                    <attribute name="cm_range_itemid" />
                                    <attribute name="cm_value" />		 
                                    <attribute name="cm_code" />
                                    <attribute name="cm_rangeid" />
                                    <attribute name="createdon" />
                                    <attribute name="createdby" />
                                    <filter type="and">
                                        <condition attribute="statecode" operator="eq" value="0" />
                                        <condition attribute="cm_rangeid" operator="in">
                                        ${mappedString}
                                        </condition>
                                    </filter>
                                </entity>
                          </fetch>`;
    var ranges = await service.retrieveMultipleRecords(
      "cm_range_item",
      "?fetchXml=" + encodeURI(fetchxmlForRange)
    );
    response.rangeItems=ranges;
  }
  return response;
}; 
export const getDmRecord=async (service: PCFWebAPI,planId:string, headerRequired:boolean,page:number,size:number)=>{
  var req = {
    // Parameters
    entity: { entityType: "cm_dm_plan", id: planId }, // entity
    HeaderRequired: headerRequired, // Edm.Boolean
    Page: page, // Edm.Boolean
    Size: size, // Edm.Boolean
  
    getMetadata: function () {
      return {
        boundParameter: "entity",
        parameterTypes: {
          entity: { typeName: "mscrm.cm_dm_plan", structuralProperty: 5 },
          HeaderRequired: { typeName: "Edm.Boolean", structuralProperty: 1 }
        },
        operationType: 0, operationName: "cm_ActionDMPlanGetAttributeList"
      };
    }
  };
 var response= await service.executeAction(req); 
 return JSON.parse(response.Response); 
}
export const saveDmRecord=async (service: PCFWebAPI,planId:string, data:any)=>{
  var req = {
    // Parameters
    entity: { entityType: "cm_dm_plan", id: planId }, // entity
    Data: JSON.stringify(data), // Edm.Boolean  
    getMetadata: function () {
      return {
        boundParameter: "entity",
        parameterTypes: {
          entity: { typeName: "mscrm.cm_dm_plan", structuralProperty: 5 },
          Data: { typeName: "Edm.String", structuralProperty: 1 }
        },
        operationType: 0, operationName: "cm_ActionDMPlanUpsertAttribute"
      };
    }
  };
 var response= await service.executeAction(req); 
 return JSON.parse(response.Response); 
}
export const deletRowsDmRecord=async (service: PCFWebAPI,planId:string, rowIds:string[])=>{
  var req = {
    // Parameters
    entity: { entityType: "cm_dm_plan", id: planId }, // entity
    RowIds: rowIds.join(','), // Edm.Boolean  
    getMetadata: function () {
      return {
        boundParameter: "entity",
        parameterTypes: {
          entity: { typeName: "mscrm.cm_dm_plan", structuralProperty: 5 },
          RowIds: { typeName: "Edm.String", structuralProperty: 1 }
        },
        operationType: 0, operationName: "cm_ActionDMPlanDeleteAttribute"
      };
    }
  };
 var response= await service.executeAction(req); 
 return JSON.parse(response.Response); 
}
