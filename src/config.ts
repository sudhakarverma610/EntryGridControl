export enum Environment{
    Local,
    Prod
}
export class Config { 
    public static tokenFromLocal="";
    public static serverUrl = 'https://cmml.crm4.dynamics.com/';//Trail Local   
    public static Environment=Environment.Prod; 
    public static ConsoleEnabled=true;
    public static refreshTimeInSecound=10;
    public static appVersion="v5.2.0";
    public static tokenUrl="https://prod-22.northeurope.logic.azure.com:443/workflows/cb172348a6d74ca69c778942c4537e1b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6TW8zWqapQov1hsb9T9aedREkRkI1VhbnkBolFZ2Lpo";
}
  