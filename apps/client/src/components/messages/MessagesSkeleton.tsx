


export default function ChannelMessagesSkeleton(){
    return (
    <div role="status" className="z-10 flex h-full w-full flex-col justify-start flex-1 overflow-hidden">
        <SkeletonGroup/>
        <SkeletonGroup/>
        <SkeletonGroup/>
        <SkeletonGroup/>
        <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>  <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>  <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>  <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>  <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>
      <SkeletonGroup/>
    </div>
    );
}

function SkeletonGroup(){
    return (
        <div role="status" className="animate-pulse py-2 px-4 bg-opacity-30">
            <h3 className="h-4 bg-gray-200 rounded-md " style={{width:"40%"}}></h3>
            <ul className="mt-5 space-y-3">
            <li className="w-full h-4 bg-slate-300 rounded-md "></li>
            <li className="w-full h-4 bg-slate-300 rounded-md "></li>
            <li className="w-full h-4 bg-slate-300 rounded-md "></li>
            <li className="w-full h-4 bg-slate-300 rounded-md "></li>
            </ul>
        </div>
    )
}
