import { Switch } from "@headlessui/react"
import {useState} from "react";


export interface ISwitchControlProps{
  label:string;
  update:(previous:boolean)=>Promise<boolean>
}
export default function SwitchControl(props:ISwitchControlProps) {
  const [enabled, setEnabled] = useState(false);
  const handleOnChange = (state:boolean)=>{
    setEnabled(state);
    setTimeout(async ()=>{
      try{
        setEnabled(await props.update(state));
      }catch (e){
        setEnabled(!state);
      }
    })
  }
  return (
    <Switch.Group>
      <div className="flex justify-between">
        <Switch.Label className="mr-4">
          {props.label}
        </Switch.Label>
        <Switch
          checked={enabled}
          onChange={handleOnChange}
          className={`${
            enabled ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </Switch.Group>
  )
}
