import { configureStore } from '@reduxjs/toolkit'
import counterreducer from './feature/counterSlice'
import gridReducer from './feature/gridSlice'
 
export const store = configureStore({
  reducer: {
    counter:counterreducer,
    grid:gridReducer,
   },
});

export const callConfigureStore =()=>{
   return store
}
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch