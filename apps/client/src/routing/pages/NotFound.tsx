import {Link, useLocation, useRoutes} from "react-router-dom";
import React from "react";
import { useAuthStatus} from "../../app/hooks/auth";


export interface INotFoundProps{
  location?:string,
  label:string
}
export default function NotFound(props:INotFoundProps){
  const location = useLocation();
  const resolvedLocation = location.pathname.split('/').slice(0,-1).join('/');
  const status = useAuthStatus();
  return (
    <div className="grid flex-1 px-4 bg-white place-content-center">
      <div className="text-center">
        <h1 className="font-black text-gray-200 text-9xl">404</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </p>

        <p className="mt-4 text-gray-500">We can't find that page.</p>

        <Link
          to={props.location??resolvedLocation}
          className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring"
        >
          Go Back to {props.label}
        </Link>
      </div>
    </div>
  );
}
