import {IUseAudioResult, IUseAudioResultController, RecordingStatus} from "./hooks/useAudio";
import {motion} from "framer-motion";
import {TbPlayerRecordFilled} from "react-icons/tb";
import {RecordPauseButton, RecordResumeButton, RecordStopButton} from "../components/buttons/AudioRecordButtons";
import React from "react";

export interface IAudioRecordingProps{
  status: RecordingStatus,
  controller: IUseAudioResultController,
  data: Blob[]
}

export function AudioRecording({status,controller,data}:IAudioRecordingProps){
  return (
    <div className={'flex-1 flex justify-end items-center gap-3'}>
      <RecordStopButton onClick={()=>controller.drop()}/>
      {
        status == RecordingStatus.recording && (
          <div className={'flex items-center gap-2 h-12'}>
            <RecordingPulse/>
            <span>
              {(controller.duration/1000).toFixed(0)}
            </span>
            <div className={'tracking-widest'} >................</div>
          </div>
        )
      }
      {
        (status == RecordingStatus.paused
          || status == RecordingStatus.finished )
        && (
          data.length && <AudioPlayer data={new Blob(data)}/>
        )
      }
      {status == RecordingStatus.paused && <RecordResumeButton onClick={controller.resume}/>}
      {status == RecordingStatus.recording &&  <RecordPauseButton onClick={controller.pause}/>}
    </div>
  );
}

function AudioPlayer({data}:{data:Blob}){
  const audioUrl = URL.createObjectURL(data);
  console.log();
  return (
    <div className={'flex border-2 border-dashed rounded-xl border-emerald-950 border-opacity-40'}>
      <audio style={{height:'35px'}} controls src={audioUrl}></audio>
    </div>
  );
}

export function RecordingPulse(){
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ repeat: Infinity,duration: 1 }}
    >
      <TbPlayerRecordFilled className={'text-red-900'}/>
    </motion.div>
  );
}
