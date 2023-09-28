export interface IInputGroupProps{
    label:string
    controlId:string;
    error?:string;
}

export function InputGroup(props:IInputGroupProps & React.InputHTMLAttributes<HTMLInputElement>){
    const {label,controlId,className,error,...rest} = props;
    return (
          <div className="flex flex-col mb-4">
                <label htmlFor={props.id} className="block mb-2 text-sm font-medium text-gray-900">Room Name</label>
                <input type="text" 
                    className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " + className}
                    {...rest}
                />
                {error &&  <p className="text-red-500 text-xs italic">{error}</p>}
            </div>
    );
}