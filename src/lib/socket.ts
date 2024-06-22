import {AT_COOKIE_NAME} from "@/apiRequest/common";
import {io} from "socket.io-client";
const socket = io("http://localhost:4004", {
  auth: {
    Authorization: `Bearer ${localStorage.getItem(AT_COOKIE_NAME)}`,
  },
});

export default socket;
