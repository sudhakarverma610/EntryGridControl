import { Provider, useDispatch } from "react-redux";
import { store } from "../store/store";
import App from "./App";
import { Store } from "../models/store";
import { IInputs } from "../../AttributeGrid/generated/ManifestTypes";
import { PCFWebAPI } from "../services/DataverseService";


export interface IAppProps {
    store: Store;
    service:PCFWebAPI 
  }
  
export default function AppProvider(props:IAppProps) {
  
  return (
    <Provider store={props.store}> 
      <App service={props.service} /> 
    </Provider>
  );
}
