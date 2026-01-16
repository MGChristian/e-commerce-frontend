import { useContext } from "react";
import { UserContext } from "../contexts/UserProvider";

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export default useUser;
