import React from "react";
import {ChannelContext} from "../providers/ChannelProvider";
import {useGetMediaDocsQuery} from "../slices/channel-media.api";
import {DownloadableFileTile} from "../components/messages/FileComponents";
import {ServerEndpoint} from "../../../api.client/client";
import {LinkButton} from "../../../components/controls/Links";
import {TfiArrowLeft} from "react-icons/tfi";
import {NavigationHeader} from "../../../components/channels/NavigationHeader";

export default function MediaDocuments(){
    const {channel} = React.useContext(ChannelContext)!;
    const {
        status,
        isError,
        error,
        isLoading,
        isSuccess,
        isFetching,
        data
    } = useGetMediaDocsQuery({
        channel:channel!.id
    });
    if(error){
        return (<div>
            {error?.data?.message}
        </div>);
    }
    if(isLoading){
        return (<div>
            Loading
        </div>);
    }
    return (
        <>
            <div className={'flex flex-wrap justify-center gap-3 px-4 py-3'}>
            {
                data?.map((media)=>{
                    const url = ServerEndpoint+'/api/media/'+media.id+'/content';
                    return (
                        <DownloadableFileTile
                            type={media.type}
                            fileName={media.fileName}
                            url={url}
                            className={' w-96 '}
                        />
                    );
                })
            }
        </div>
        </>
    );
}
