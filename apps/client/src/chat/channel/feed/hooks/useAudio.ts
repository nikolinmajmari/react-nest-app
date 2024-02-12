import React from "react";
import StopWatch from "../../../../util/stop_watch";
import {ToastNotificationContext} from "../../../../providers/ToastNotificationProvider";

export enum RecordingStatus{
  idle,
  loading,
  recording,
  paused,
  finished
}

export interface IUseAudioResultController{
  duration:number,
  pause: ()=>void,
  finish: ()=>void,
  drop: ()=>void,
  resume: ()=>void,
}

export interface IUseAudioResult{
  status:RecordingStatus,
  hasAudio: boolean,
  empty:boolean,
  loading: boolean,
  dataRef: React.MutableRefObject<Blob[]>,
  recorderRef: React.MutableRefObject<MediaRecorder>,
  startRecording:()=>void,
  controller: IUseAudioResultController
}
export default function useAudio(){
  const toast = React.useContext(ToastNotificationContext);
  const [duration,setDuration] = React.useState<number>(0);
  const [status,setStatus] = React.useState<RecordingStatus>(RecordingStatus.idle);
  const dataRef = React.useRef<Blob[]>([]);
  const recorderRef = React.useRef<MediaRecorder>(null);
  const watch = React.useRef(new StopWatch({interval:1000}));
  const onStopWatch = (d:number)=>setDuration(d);
  React.useEffect(()=>{
    watch.current.addIntervalListener(onStopWatch);
    return ()=>watch.current.removeListener(onStopWatch);
  });

  const startRecording = ()=>{
    if(navigator.mediaDevices){
      console.log('media devices are supported');
      if(status==RecordingStatus.idle){
        setStatus(RecordingStatus.loading);
      }
      navigator.mediaDevices.getUserMedia({audio:true})
        .then((stream)=>{
          if(recorderRef.current==null){
            // @ts-ignore
            recorderRef.current = new MediaRecorder(stream);
            // @ts-ignore
            recorderRef.current.ondataavailable = (e:BlobEvent)=>{
              dataRef.current.push(e.data);
            }
          }
          dataRef.current = [];
          setStatus(RecordingStatus.recording);
          watch.current.start();
          recorderRef.current?.start();
        })
        .catch((e)=>{
          toast?.error(e.message);
          setStatus(RecordingStatus.idle);
        })
    }
  }

  const pause = ()=>{
    recorderRef.current?.requestData();
    recorderRef.current?.pause();
    watch.current.pause();
    setStatus(RecordingStatus.paused);
  }
  const finish = ()=>{
    if(recorderRef.current?.state!=='inactive'){
      recorderRef.current?.requestData();
      recorderRef.current?.stop();
      recorderRef.current?.stream.getAudioTracks().forEach((t)=>{
        t.stop();
      })
    }
    watch.current.stop();
    setStatus(RecordingStatus.finished);
  }
  const drop = ()=>{
    if(recorderRef.current?.state !=='inactive'){
      recorderRef.current?.requestData();
      recorderRef.current?.stop();
      recorderRef.current?.stream.getAudioTracks().forEach((t)=>{
        t.stop();
      })
    }
    // @ts-ignore
    recorderRef.current = null;
    watch.current.reset();
    setStatus(RecordingStatus.idle);
    dataRef.current = [];
  }
  const resume = ()=>{
    recorderRef.current?.resume();
    watch.current.start();
    setStatus(RecordingStatus.recording);
  }
  return {
    status,
    hasAudio: (status!==RecordingStatus.idle && status!== RecordingStatus.loading),
    loading: status===RecordingStatus.loading,
    empty: status===RecordingStatus.idle,
    dataRef,
      recorderRef,
    startRecording,
    controller: {
      duration,
      pause,
      finish,
      drop,
      resume,
    }
  }
}
