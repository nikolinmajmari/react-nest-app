import {useAppDispatch} from "../../../../../app/hooks";
import {useCallback} from "react";
import {
  abortMediaProgress,
  completeMediaProgress, restartMediaProgress,
  startMediaProgress,
  updateMediaProgress
} from "../../channel-feed.slice";

export function useMediaProgress(){
  const dispatch = useAppDispatch();

  const start = useCallback((slug:string,requestKey:string)=>{
    dispatch(startMediaProgress({slug,requestKey}))
  },[dispatch])

  const update = useCallback((slug:string,progress:number)=>{
    dispatch(updateMediaProgress({slug, progress: progress ?? 0}))
  },[dispatch]);

  const complete = useCallback((slug:string)=>{
    dispatch(completeMediaProgress({slug}));
  },[dispatch]);

  const abort = useCallback((slug:string)=>{
    dispatch(abortMediaProgress({slug}));
  },[dispatch]);

  const restart = useCallback((slug:string)=>{
    dispatch(restartMediaProgress({slug}))
  },[dispatch]);


  return {
    start,update,complete,abort,restart
  };
}
