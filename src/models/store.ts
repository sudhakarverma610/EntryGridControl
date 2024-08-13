import {  StoreEnhancer, ThunkDispatch, ThunkMiddleware, Tuple, UnknownAction } from '@reduxjs/toolkit';
import { EnhancedStore } from '@reduxjs/toolkit/dist/configureStore';

export type Store =EnhancedStore<{
    counter: {
        value: number;
    };
}, UnknownAction, Tuple<[StoreEnhancer<{
    dispatch: ThunkDispatch<{
        counter: {
            value: number;
        };        
    }, undefined, UnknownAction>;
}>, StoreEnhancer]>>