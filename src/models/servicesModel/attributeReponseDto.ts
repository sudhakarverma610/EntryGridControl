export type attributeReponse={
   attribute: ComponentFramework.WebApi.RetrieveMultipleResponse
   rangeItems: ComponentFramework.WebApi.RetrieveMultipleResponse
}
export enum FieldType
{
    Text = 0,
    TextArea = 1,
    Number = 2,
    Dropdown = 3,
    MultiSelectDropdown = 4,
    DateOnly = 5,
    DateAndTime = 6,
    Url=7
}

export const sampleDMPlan={
   "Header": [
       {
           "Name": "Student Name",
           "DisplayName": "name",
           "DataType": 0,
           "Items": null,
           "Id": "5e0fc39d-4a39-ef11-a316-000d3ab15c53"
       },
       {
           "Name": "Date of Birth",
           "DisplayName": "dob",
           "DataType": 0,
           "Items": null,
           "Id": "7e872cc5-4a39-ef11-a316-000d3ab15c53"
       },
       {
           "Name": "Mobile No",
           "DisplayName": "mobile",
           "DataType": 2,
           "Items": null,
           "Id": "0a7916d6-4a39-ef11-a316-000d3ab15c53"
       },
       {
           "Name": "Gender",
           "DisplayName": "gender",
           "DataType": 3,
           "Items": [
               {
                   "Name": "Male",
                   "Value": 0,
                   "Id": "c0e41b0b-4b39-ef11-a316-000d3ab15c53"
               },
               {
                   "Name": "Female",
                   "Value": 1,
                   "Id": "fca0c411-4b39-ef11-a316-000d3ab15c53"
               },
               {
                   "Name": "Other",
                   "Value": 2,
                   "Id": "b14f3320-4b39-ef11-a316-000d3ab15c53"
               }
           ],
           "Id": "457b44f2-4a39-ef11-a316-000d3ab15c53"
       }
   ],
   "Attributes": [
       {
           "name": "Dhh",
           "dob": "01-07-1997",
           "mobile": "6398259910",
           "rowNo": "2"
       },
       {
           "gender": "Female",
           "name": "Sudhakar",
           "dob": "01/01/2000",
           "mobile": "6398259910",
           "rowNo": "1"
       }
   ]
}