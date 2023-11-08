import {useLocation, useNavigate} from "react-router-dom";
import {useCallback} from "react";

export function useGoBack() {
  const location = useLocation();
  const navigate = useNavigate();
  const goBack =  useCallback(() => navigate(location.state?.previousLocation ?? "/chat/channels"), [navigate, location.state]);
  return {
    goBack,state:location.state
  }
}
