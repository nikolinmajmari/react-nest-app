import {Dialog} from "@headlessui/react";
import Modal from "../../../../components/modals/Modal";
import {Link, useLocation, useNavigate} from "react-router-dom";

export default function NewChannelModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const back = () => navigate(location.state?.previousLocation ?? "/chat/channels");

  return (
    <Modal close={back}>
      <Dialog.Title
        as="h3"
        className="text-lg font-medium leading-6 text-gray-900"
      >
        Create New Channel
      </Dialog.Title>
      <Dialog.Description>
        <div className="flex flex-row h-32 items-center justify-around">
          <Link state={location.state}
                className="cursor-pointer bg-blue-300 flex items-center justify-center h-16 text-slate-800 hover:bg-blue-500 hover:text-white font-bold uppercase text-sm px-8 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                to={"/chat/channels/private/new"}>
            <label className="cursor-pointer"> Private Channel</label>
          </Link>
          <Link state={location.state}
                className=" cursor-pointer bg-blue-300 flex items-center justify-center  h-16 text-slate-800 hover:bg-blue-500 hover:text-white font-bold uppercase text-sm px-8 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                to={"/chat/channels/group/new"}>
            <label className="cursor-pointer">Group Channel</label>
          </Link>
        </div>
      </Dialog.Description>
    </Modal>
  );
}
