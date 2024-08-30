import { Provider } from "react-redux";
import App from "./App";
import { Store } from "../models/store";
import { PCFWebAPI } from "../services/DataverseService";


export interface IAppProps {
    store: Store;
    service:PCFWebAPI 
  }
  
export default function AppProvider(props:IAppProps) {
  
  return (
    <Provider store={props.store}> 
      <App service={props.service}  /> 
    </Provider>
  );
}
