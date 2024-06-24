import {AT_COOKIE_NAME} from "@/apiRequest/common";
import {io} from "socket.io-client";

const access_token = localStorage?.getItem(AT_COOKIE_NAME) ?? "";

const socket = io("http://localhost:4004", {
  auth: {
    Authorization: `Bearer ${access_token ?? ""}`,
  },
});

export default socket;
