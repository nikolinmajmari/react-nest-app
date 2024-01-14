import React, {MutableRefObject} from "react";

export interface IEntryContentProps{
  disabled:boolean,
}

const EntryContent = React.forwardRef((props:IEntryContentProps,ref)=>{

  const handleResize = (target: HTMLDivElement) => {
    target.style.height = "1px";
    target.style.height = `${Math.min(Math.max(target?.scrollHeight, 20), 160)}px`;
  }

  return (
    <div className="flex flex-row items-start bg-white px-2 py-3 rounded-lg flex-1
                        dark:bg-gray-700 dark:text-white text-sm">
      <div
        contentEditable={
          props.disabled ? undefined:'true'
        }
        ref={ref as MutableRefObject<HTMLDivElement>}
        onKeyUp={props.disabled ? undefined:(e) => handleResize(e.target as HTMLDivElement)}
        onKeyDown={props.disabled ? undefined:(e) => handleResize(e.target as HTMLDivElement)}
        className='flex-1 overflow-auto h-5 bg-transparent outline-none focus:outline-none'
      >
      </div>
    </div>
  );
});
export default EntryContent;
