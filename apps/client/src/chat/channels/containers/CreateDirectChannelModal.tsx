import { Dialog } from "@headlessui/react";
import Modal, { IModalProps } from "../../../components/modals/Modal";
import React from "react";
import { IUser, MemberRole } from "@mdm/mdm-core";
import { users } from "../../../api.client/client";
import { useCreatePrivateChannel } from "../../../hooks/channels.hooks";
import { useAsyncHook } from "../../../hooks/core.hooks";
import { SearchComponent, SearchedUserItem } from "../../../components/inputs/Search";
import ErrorComponent from "../../../components/ErrorComponent";


export default function CreateDirectChannelModal({open,setOpen}:IModalProps){
    const [search,setSearch] = React.useState('');
    const [results,setResults] = React.useState<IUser[]>([]);
    const [selected,setSelected] = React.useState<string|null>(null);
    const createChannel = useCreatePrivateChannel()
    const [{status,error,success},createChannelHook] = useAsyncHook(
        async ()=>await createChannel({
            alias: '',
            avatar: 'https://google.com.png/https.png',
            members:[
                {role:MemberRole.admin,user:selected}
            ]
        }).unwrap()
    );
    React.useEffect(()=>{
        const timeout = setTimeout(
            async ()=>{
                const result = await users.get({
                    offset:0,
                    limit:5,
                    privateChannelCandidate: "true",
                    search,
                });
                setResults(result);
                setSelected(null)
            }
        );
        return ()=>clearTimeout(timeout);
    },[search]);
    React.useEffect(()=>{
       if(open){
         setSearch('');
         setResults([]);
       }
    },[open]);
    React.useEffect(()=>{
       let timeout:any;
       if(status==="success"||status==="failed"){
        timeout = setTimeout(()=>setOpen(false),6000);
       }
       return ()=>{
         if(timeout){
            clearTimeout(timeout);
         }
       }
    },[status]);

    console.log(error);
    return (
        <Modal {...{open,setOpen}}>
            <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                Create New Private Channel
            </Dialog.Title>
            {
                status === 'idle' && (
                <div className="mt-2 text-sm flex flex-col">
                    <SearchComponent value={search} onChange={(e)=>setSearch(e.target.value)} type="search" id="default-search"  placeholder="Search Mockups, Logos..." required />
                    <div className="results flex flex-col overflow-y-auto h-60 mb-4">
                        {
                            results.map(
                                user=><SearchedUserItem key={user.id} user={user} selected={user.id===selected} onPress={()=>setSelected(user.id)}/>
                            )
                        }
                     </div>
                    <button
                        type="button"
                        className="inline-flex self-end justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={createChannelHook}
                        >
                            Create
                    </button>
                </div>)
            }
            {
                status === "loading" && (<Loading/>)
            }
            {
                status === "failed" && (<ErrorComponent error={error.message}/>)
            }
            {
                status === "success" && (<div>Channel created successfully</div>)
            }
        </Modal>
    );
}


export function Loading(){
    return (
        <div className="flex flex-row justify-center px-12 py-8">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status">
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                        </div> 
                    </div>
    );
}