import { RouterProvider } from "react-router-dom";
import routers from "./router";
import { isAuthenticatedAtom, tokenAtom } from "./store/authAtom";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

function App() {
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setToken = useSetAtom(tokenAtom);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setToken(token);
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated, setToken]);

  return (
    <>
      <RouterProvider router={routers} />
    </>
  );
}

export default App;
