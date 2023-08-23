export default function Message(){
    return (
         <div className="message flex flex-row items-end py-2">
                    <div className="avatar flex items-center justify-center bg-teal-400 text-white mx-2 rounded-full h-12 w-12">
                        <span className="">A</span>
                    </div>
                    <div className="w-2/3 flex flex-row">
                        <div className="bubble bg-white px-6 py-4 rounded-md">
                        Lorem lipsum supdum lorem lorum marnum dopsum
                        Lorem lipsum supdum lorem lorum marnum dopsum
                        Lorem lipsum supdum lorem lorum marnum dopsum
                        </div>
                    </div>
                </div>
    );
}