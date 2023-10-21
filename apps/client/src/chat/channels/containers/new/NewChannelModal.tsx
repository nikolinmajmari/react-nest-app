import {Dialog} from "@headlessui/react";
import Modal from "../../../../components/modals/Modal";
import React, {FormEvent, useCallback} from "react";
import {ChannelType, IUser, MemberRole} from "@mdm/mdm-core";
import {users} from "../../../../api.client/client";
import {SearchComponent, SearchedUserItem} from "../../../../components/inputs/Search";
import ErrorComponent from "../../../../components/ErrorComponent";
import {useLocation, useNavigate} from "react-router-dom";
import {InputGroup} from "../../../../components/inputs/InputGroup";
import AsyncRender from "../../../../components/core/AsyncRender";
import {NotificationContext} from "../../../../components/notifications/Toastify";
import {useCurrentUser} from "../../../../app/hooks/auth";
import {useDispatchCreateChannel} from "../../../../app/hooks/channels";
import {useAsyncHook} from "../../../../app/hooks/core";

export interface ICreateChannelModalProps {
    type: "private" | "group",
    title: string;
}

export interface ICreateChannelValidation {
    selected?: string | undefined;
    name?: string | undefined;
    avatar?: string | undefined;
}

export default function NewChannelModal(props: ICreateChannelModalProps) {
    /// usefull hooks and callbacks
    const location = useLocation();
    const navigate = useNavigate();
    const user = useCurrentUser();
    const createChannel = useDispatchCreateChannel(props.type === "private" ? ChannelType.private : ChannelType.group);
    const notification = React.useContext(NotificationContext);
    const back = useCallback(() => navigate(location.state?.previousLocation ?? "/chat/channels"), [navigate, location.state]);

    //// forms and validations

    const [search, setSearch] = React.useState('');
    const [results, setResults] = React.useState<IUser[]>([]);

    const [selected, setSelected] = React.useState<IUser[]>([]);

    const [channelName, setChannelName] = React.useState('');
    /// validation
    const [validation, setValidation] = React.useState<ICreateChannelValidation>({});

    //// trigger search as soon as user types something, delay 0.75 s
    React.useEffect(() => {
        const timeout = setTimeout(async () => {
            const result = await users.get({offset: 0, limit: 5, privateChannelCandidate: "true", search});
            setResults(result.filter(u => u.id != user.id!));
        }, 750);
        return () => clearTimeout(timeout);
    }, [search, user]);

    ///// form submission
    const [{status, error}, createChannelHook] = useAsyncHook(
        () => createChannel({
            alias: channelName ?? '',
            avatar: 'https://google.com.png/https.png',
            members: selected.map((u) => ({
                user: u.id,
                role: props.type === "private" ? MemberRole.admin : MemberRole.member
            }))
        }).unwrap());
    React.useEffect(() => {
        const timeout = (status === "success" || status === "failed") ? setTimeout(() => {
            back();
            if (status === "success") {
                notification?.success('Channel created succesfully');
            }
            if (status === 'failed') {
                notification?.error(error);
            }
        }, 0) : null;
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [back, status]);

    const validate = () => {
        if (selected.length === 0) {
            setValidation({selected: 'You should select at least one user to create a room'});
            return false;
        }
        if (props.type === "group") {
            if (!channelName.trim()) {
                setValidation({name: "Please fill in the name of the channel"});
                return false;
            }
        }
        return true;
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            createChannelHook().then(r => 1);
        }
    }

    return (<Modal close={back}>
            <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
            >
                {props.title}
            </Dialog.Title>
            <AsyncRender
                success={<div>Channel created successfully</div>}
                failed={<ErrorComponent error={error?.message}/>}
                status={status}
                loading={<Loading/>}
            >
                <form onSubmit={handleSubmit} className="mt-2 text-sm flex flex-col">
                    <UserSearchPicker
                        results={results}
                        selected={selected}
                        setSelected={setSelected}
                        search={search}
                        setSearch={setSearch}
                        multiple={props.type === "group"}
                        error={validation.selected}
                    />
                    {props.type === 'group' && (<InputGroup
                            label="Room Name"
                            controlId="room_name"
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                            placeholder="Type Name Here"
                            error={validation.name}
                            required
                        />)}
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Create
                    </button>
                </form>
            </AsyncRender>
        </Modal>);
}


export interface IUserSearchPcikerProps {
    selected: IUser[],
    setSelected: React.Dispatch<React.SetStateAction<IUser[]>>;
    results: IUser[],
    multiple: boolean;
    search: string,
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    error?: string | undefined;
}

export function UserSearchPicker({
                                     selected, setSelected, results, search, setSearch, error, multiple
                                 }: IUserSearchPcikerProps) {
    const toggleSelectUser = (user: IUser) => {
        setSelected((users) => {
            if (users.findIndex(u => u.id === user.id) === -1) {
                if (!multiple) {
                    return [user];
                }
                return [...users, user];
            }
            return [...users.filter(u => u.id !== user.id)];
        });
    }

    return (<div className="flex flex-col items-stretch justify-start">
            <SearchComponent value={search} onChange={(e) => setSearch(e.target.value)} type="search"
                             id="default-search"
                             placeholder="Search Users"/>
            <SelectedUsers toggleUser={toggleSelectUser} users={selected}/>
            <div className="results flex flex-col overflow-y-auto mb-4 h-64">
                {results.map(user => <SearchedUserItem key={user.id}
                                                       user={user}
                                                       selected={selected.findIndex(u => u.id === user.id) !== -1}
                                                       onPress={() => toggleSelectUser(user)}
                />)}
                <p className="text-red-500 text-xs italic">{error}</p>
            </div>
        </div>)
}


export interface ISelectedUsersProps {
    users: IUser[],
    toggleUser: (u: IUser) => void
}

export function SelectedUsers({users, toggleUser}: ISelectedUsersProps) {
    return (<div className="flex flex-row gap-2 py-2 px-2 flex-wrap">
            {users.map(user => <Chip remove={() => toggleUser(user)} label={`${user.firstName} ${user.lastName}`}/>)}
        </div>)
}

export function Chip({label, remove}: { label: string, remove: () => void }) {
    return (<div
            className="center relative flex flex-row items-center bg-slate-300 select-none whitespace-nowrap rounded-lg bg-gradient-to-tr  py-1 px-2.5 align-baseline font-sans  leading-none text-slate-600"
        >
            <div className="mr-5 mt-px text-xs" style={{fontSize: "11px"}}>{label}</div>
            <div
                onClick={() => remove()}
                className="absolute top-1 right-1 mx-px mt-[0.5px] w-max rounded-md bg-slate-860 transition-colors hover:bg-slate-500"
            >
                <div className="w-3 h-3 cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="3"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>)
}

export function Loading() {
    return (<div className="flex flex-row justify-center px-12 py-8">
            <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
        <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
        </div>);
}
