import {Link} from "react-router-dom";

export function SettingsBody(props: any) {
  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100 dark:bg-gray-700 dark:text-white py-2">
      <div className="flex w-full px-8 lg:w-2/3 md:flex-4/5 flex-col items-stretch pb-40">
        {props.children}
      </div>
    </div>
  )
}


export function SettingsAvatar(props: { label: string }) {
  return <span className="flex flex-row justify-center">
        <div className="bg-teal-800 w-40 h-40 rounded-full flex items-center justify-center">
            <span className="text-3xl text-white">{props.label}</span>
        </div>
    </span>;
}

export function SettingsChannelName(props: { label: string }) {
  return (
    <span className="text-center text-2xl font-bold py-2">
            {props.label}
        </span>
  );
}

export interface ISettingsListItemLinkProps {
  to?: string;
  children?: React.ReactNode;
}

export function SettingsListItemLink(props: ISettingsListItemLinkProps) {
  return (
    <Link to={props.to ?? "#"}
          className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
      {props.children}
    </Link>
  );
}
