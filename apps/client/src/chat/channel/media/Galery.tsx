import {useGetMediaGalleryQuery} from "../slices/channel-media.api";
import React from "react";
import {ChannelContext} from "../providers/ChannelProvider";
import {toast} from "react-toastify";
import {IMedia} from "@mdm/mdm-core";
import {ServerEndpoint} from "../../../api.client/client";
import {BackdropBlurDownloadButton} from "../components/Buttons";
import Modal, {ExtraLargeModal} from "../../../components/modals/Modal";

export default function MediaGallery(){
    const {channel} = React.useContext(ChannelContext)!;
    const {
        status,
        isError,
        error,
        isLoading,
        isSuccess,
        isFetching,
        data
    } = useGetMediaGalleryQuery({
        channel:channel!.id
    });
    if(error){
        return (<div>
            {(error as any)?.data?.message}
        </div>);
    }
    if(isLoading){
        return (<div>
            Loading
        </div>);
    }
    return (
        <>
            <div className={'flex flex-wrap justify-center px-4 py-2 gap-3 bg-emerald-50 flex-1 overflow-y-auto'}>
                {
                    data?.map((media:IMedia)=>{
                        const thumbnail = ServerEndpoint+'/api/media/'+media.id+'/thumbnail';
                        const url = ServerEndpoint+'/api/media/'+media.id+'/content';
                        return (
                            <div className={'h-48 w-48 md:w-56 md:h-56 lg:w-64 lg:h-64'}>
                                <GaleryImage url={url} thumbnail={thumbnail}/>
                            </div>
                        );
                    })
                }
            </div>
        </>
    );
}

export interface IImageProps{
    url:string;
    thumbnail:string;
}
export function GaleryImage(props:IImageProps) {
    // eslint-disable-next-line jsx-a11y/alt-text

    const [show,setShow] = React.useState<boolean>(false);
    function showModal(){
      setShow(true);
    }
    function hideModal(){
      setShow(false)
    }
    return (
        <>
          <div onClick={showModal} className={'relative'}>
            <BackdropBlurDownloadButton
              className={'absolute bottom-1 right-1'}
              href={props.url+'?attachment=1'}
            />
            <div onClick={showModal}>
              <img loading={'lazy'} src={props.thumbnail??props.url} className="cursor-pointer
                h-full w-full object-cover rounded-lg"/>
            </div>
          </div>
          {
            show && <ExtraLargeModal close={hideModal}>
              <LargeImageViewer url={props.url} thumbnail={props.thumbnail}/>
            </ExtraLargeModal>
          }
        </>
    );
}

export function LargeImageViewer(props:IImageProps){
  return (
    <div className={'relative'}>
      <BackdropBlurDownloadButton
        className={'absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-28 h-28'}
        size={48}
        target={'_blank'}
        href={props.url+'?attachment=1'}
      />
      <img alt={props.thumbnail} loading={'lazy'} src={props.url} className="cursor-pointer
                h-full w-full object-cover rounded-lg"/>
    </div>
  );
}
