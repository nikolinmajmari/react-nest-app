import {useCurrentUser} from "../../app/hooks/auth";
import React from "react";
import {IUser} from "@mdm/mdm-core";
import {users} from "../../api.client/client";

export function useSearchUser() {
  const user = useCurrentUser();
  const [results, setResults] = React.useState<IUser[]>([]);
  const [search, setSearch] = React.useState('');
  //// trigger search as soon as user types something, delay 0.75 s
  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      const result = await users.get({offset: 0, limit: 5, privateChannelCandidate: "true", search});
      setResults(result.filter(u => u.id != user.id!));
    }, 750);
    return () => clearTimeout(timeout);
  }, [search, user]);
  return {search, results, setSearch};
}
