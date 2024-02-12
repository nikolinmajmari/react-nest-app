import React from "react";

export default  function AudioPlayer({uri}:{uri:string}){
    return (
        <div className={'flex border-2 border-dashed rounded-xl border-emerald-950 border-opacity-40'}>
            <audio style={{height:'35px'}} controls src={uri}></audio>
        </div>
    );
}
