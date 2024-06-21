"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import {AppContext} from "@/app/(home)/AppProvider";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import socket from "@/lib/socket";
import {useQuery} from "@tanstack/react-query";
import {FormEvent, useContext, useEffect, useState} from "react";

const useQueryUserByUsername = (username: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.GET_USER_BY_USERNAME, username],
    queryFn: () => apiAuthRequest.getUserByUsername(username),
    enabled: !!username,
  });
};

const username = ["user666998f28d477b9b06aec7a5", "lqthai123"];

export default function ChatPage() {
  const {user} = useContext(AppContext);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<
    {content: string; from: string; isSender: boolean}[]
  >([]);
  const [userName, setUserName] = useState<string>("");

  const {data: userByUsername} = useQuery({
    queryKey: [QUERY_KEY.GET_USER_BY_USERNAME, userName],
    queryFn: () => apiAuthRequest.getUserByUsername(userName),
    enabled: !!userName,
  });

  console.log("userByUsername", userByUsername);
  useEffect(() => {
    if (!user || !user._id) return;
    socket.auth = {_id: user._id};
    socket.connect();
    socket.on(
      "receive_private_message",
      (data: {content: string; from: string}) => {
        console.log(data);
        setMessages((message) => [
          ...message,
          {
            content: data.content,
            from: data.from,
            isSender: false,
          },
        ]);
      }
    );
    return () => {
      socket.disconnect();
    };
  }, []);

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("private_message", {
      content: value,
      to: userByUsername?.payload?.data?._id,
      from: user?._id,
    });
    setValue("");
    // Gửi thì set isSender là true
    setMessages((message) => [
      ...message,
      {
        content: value,
        from: user?._id!,
        isSender: true,
      },
    ]);
  };
  return (
    <div className="p-52">
      <h1 className="font-bold text-xl">Hello, I&apos;m {user?.name}</h1>
      <div className="my-2">
        {username.map((username) => (
          <button
            key={username}
            onClick={() => setUserName(username)}
            className="border border-blue-400 mb-4 p-1 rounded-xl"
          >
            Chat with {username}
          </button>
        ))}
      </div>
      <h2>Chat App</h2>
      <div className="bg-white p-2 mb-3 w-56 max-h-[200px] overflow-y-scroll">
        {messages.map((message, index) => (
          <div key={index}>
            <div className="flex">
              <div
                className={`bg-blue-400 mb-1 p-1 mt-auto ${
                  message.isSender ? "ml-auto" : ""
                }`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
