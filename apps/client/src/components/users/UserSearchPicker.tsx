import {IUser} from "@mdm/mdm-core";
import {SearchComponent, SearchedUserItem} from "../inputs/Search";
import React from "react";
import {Chip} from "../../chat/channels/new/NewChannelModal";
import {useSearchUser} from "./useSearchUser";

export interface IUserSearchPickerProps {
  selected: IUser[],
  toggleSelected: (_:IUser)=>void;
  multiple: boolean;
  error?: string | undefined;
}

export function UserSearchPicker({selected, toggleSelected, error, multiple}: IUserSearchPickerProps) {
  const {
    search, setSearch, results,
  } = useSearchUser();
  return (
    <div className="flex flex-col items-stretch justify-start">
      <SearchComponent value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       type="search"
                       id="default-search"
                       placeholder="Search Users"/>
      <div className="flex flex-row gap-2 py-2 px-2 flex-wrap">
        {
          selected.map((user,index) =>
            <Chip remove={() => toggleSelected(user)}
                  user={user}
                  index={index}
                  label={`${user.firstName} ${user.lastName}`}/>
          )
        }
      </div>
      <div className="results flex flex-col overflow-y-auto mb-4 h-64">
        {
          results.map(user =>
            <SearchedUserItem  key={user.id}
                               user={user}
                               selected={selected.findIndex(u => u.id === user.id) !== -1}
                               onPress={() => toggleSelected(user)}/>
          )
        }
        <p className="text-red-500 text-xs italic">{error}</p>
      </div>
    </div>)
}

