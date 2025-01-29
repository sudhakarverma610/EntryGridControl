 import { IInputs } from "../../AttributeGrid/generated/ManifestTypes";
import { Config, Environment } from "../config";
enum operationType{
    Action,
    Function,
    CRUD
}
interface IMetaData{
    boundParameter:string;
    operationName:string;
    operationType:operationType;
    parameterTypes:any;
}
interface IRequest{
    getMetadata():IMetaData,

}

 export class PCFWebAPI implements ComponentFramework.WebApi {
    _context: ComponentFramework.Context<IInputs>;
    isInLocal = false;
    _baseAPiURL = Config.serverUrl + "/api/data/v9.0/"
    _token = "";
    DefaultHeaders = [
        { key: "Accept", value: "application/json" },
        { key: "OData-Version", value: "4.0" },
        { key: "OData-MaxVersion", value: "4.0" },
        { key: "Content-Type", value: "application/json; charset=utf-8" },
        { key: "Prefer", value: "odata.include-annotations=\"*\"" },
    ];

    GetSetName = (entityName: string, overriddenSetName?: string) => {
        if (overriddenSetName) {
            return overriddenSetName;
        }
        var ending = entityName.slice(-1);
        switch (ending) {
            case 's':
                return entityName + "es";
            case 'y':
                return entityName.substring(0, entityName.length - 1) + "ies";
            default:
                return entityName + "s";
        }
    };
    updateRowNumber: (newValue: number) => void;
    getContext(){
        return this._context;
    }
    constructor(context: ComponentFramework.Context<IInputs>,updateRowNumber:(newValue: number) => void) {
        this._context = context;
        this.isInLocal = !(context.userSettings.securityRoles.length > 0);
        var token = localStorage.getItem("token");
        if (token)
            this._token = token;
        this.updateRowNumber=updateRowNumber;
    }
    createRecord(entityType: string, data: ComponentFramework.WebApi.Entity): Promise<ComponentFramework.LookupValue> {
        if (this.isInLocal) {
            if (!entityType) {
                throw new Error("Entity name and entity object have to be passed!");
            }
            var url = this.GetSetName(entityType);
            return this.SendRequest<ComponentFramework.LookupValue>("POST", url, data).then(it => {
                it.entityType = entityType;
                return it;
            });
        }
        return this._context.webAPI.createRecord(entityType, data);
    }
    deleteRecord(entityType: string, id: string): Promise<ComponentFramework.LookupValue> {
        if (this.isInLocal) {
            var url = this.GetSetName(entityType);
            url += "(" + id + ")";
            return this.SendRequest<ComponentFramework.LookupValue>("DELETE", url, null).then(it => {
                return { id: id, entityType: entityType }
            });
        }
        return this._context.webAPI.deleteRecord(entityType, id);
    }
    updateRecord(entityType: string, id: string, data: ComponentFramework.WebApi.Entity): Promise<ComponentFramework.LookupValue> {
        if (this.isInLocal) {

            if (!entityType) {
                throw new Error("Update object has to be passed!");
            }
            var url = this.GetSetName(entityType);
            url += "(" + id + ")";
            return this.SendRequest("PATCH", url, data);
        }
        return this._context.webAPI.updateRecord(entityType, id, data).then(it => {
            return { id: id, entityType: entityType }
        });
    }
    retrieveMultipleRecords(entityType: string, options?: any | undefined, maxPageSize?: number | undefined): Promise<ComponentFramework.WebApi.RetrieveMultipleResponse> {
        if (this.isInLocal) {
            if (!entityType) {
                throw new Error("Entity name has to be passed!");
            }
            var url = this.GetSetName(entityType);
            if (options) {
                url += options;
            }
            return this.SendRequest<ComponentFramework.WebApi.RetrieveMultipleResponse>("GET", url, null).then(
                (it: any) => {
                    const obj = {
                        entities: it?.value
                    }
                    return obj as ComponentFramework.WebApi.RetrieveMultipleResponse;
                });
        }
        return this._context.webAPI.retrieveMultipleRecords(entityType, options);
    }
    retrieveRecord(entityType: string, id: string, options?: string | undefined): Promise<ComponentFramework.WebApi.Entity> {
        if (this.isInLocal) {
            console.log("I am in local ");

            if (!entityType) {
                throw new Error("Entity name has to be passed!");
            }

            var url = this.GetSetName(entityType);

            if (id) {
                url += "(" + id + ")";
            }
            if (options) {
                url += options;
            }
            return this.SendRequest("GET", url, null);
        }
        return this._context.webAPI.retrieveRecord(entityType, id, options);
    }
    executeAction(request:any):Promise<any>{
        if(this.isInLocal){
            var url = this.GetSetName(request?.entity?.entityType);
            var id=request?.entity?.id;
            var metaData=request.getMetadata();
            url=url+"("+id+")/Microsoft.Dynamics.CRM."+metaData.operationName;
            var parms:any={};
            Object.keys(request)?.forEach(key=>{
                if(key !=="entity"&&key!=="getMetadata"){
                    parms[key]=request[key];
                }
            })
            return this.SendRequest<any>("POST", url, parms).then(it => {
               
                return it;
            });
        }
        var webAPI=this._context.webAPI as any
        return webAPI.execute(request).then((it:any)=>{
            return it.json();
        });
    }

    async SendRequest<T>(method: string, url: string, payload: any): Promise<T> {
        var myHeaders = new Headers();
        if (Config.Environment == Environment.Local)
            myHeaders.append("Authorization", "Bearer " + this._token);
        this.DefaultHeaders.forEach(it => {
            myHeaders.append(it.key, it.value);
        })
        var requestOptions: RequestInit = {
            method: method,
            headers: myHeaders,
        };
        if (Config.Environment !== Environment.Local) {
            requestOptions.credentials = 'include';
        }
        if (payload) {
            requestOptions.body = JSON.stringify(payload);
        }
        var response = fetch(this._baseAPiURL + url, requestOptions);
        var it = await response;
        console.log('response',it)
        if (it.status == 401) {
            if(Config.tokenFromLocal){
                
                this._token = Config.tokenFromLocal;
            }else{
                var token = await this.getToken();
                localStorage.setItem("token", token.token);
                this._token = token.token;
            }
           
            return this.SendRequest(method, url, payload)
        }
        if (it.status == 204) {
            if (method.toLowerCase() === "post") {
                let urlEntityId = it.headers.get('OData-EntityId');
                if (urlEntityId)
                    return { id: urlEntityId.substring(urlEntityId.lastIndexOf("(") + 1, urlEntityId.lastIndexOf(")")) } as T
            }
        }
        return it.json() as T;
    }
    async getToken() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "url": Config.serverUrl
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };
        var response = await fetch(Config.tokenUrl, requestOptions);
        return response.json();

    }
}
