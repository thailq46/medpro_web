"use client";
import {
  IConversationBody,
  IGetUserChatWithMeBody,
} from "@/apiRequest/ApiConversation";
import {AppContext} from "@/app/(home)/AppProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import socket from "@/lib/socket";
import ConversationPage from "@/module/chat/ConversationPage";
import {checkUserOnline} from "@/module/chat/helper";
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import {useContext, useEffect, useState} from "react";
import styles from "./Chat.module.scss";

dayjs.extend(relativeTime);

interface IOnlineUsers {
  user_id: string;
  last_online: Date | null;
}

interface IConversation {
  _id: string;
  avatar: string;
  name: string;
  username: string;
  lastMessage: IConversationBody;
}

export default function ChatTest() {
  const {user} = useContext(AppContext);
  const [onlineUsers, setOnlineUsers] = useState<IOnlineUsers[]>([]);
  const [messages, setMessages] = useState<IConversationBody[]>([]);
  const [userSelected, setUserSelected] =
    useState<IGetUserChatWithMeBody | null>(null);
  const [allUser, setAllUser] = useState<IConversation[]>([]);

  useEffect(() => {
    if (!user || !user._id) return;
    socket.on("online_users", (data: IOnlineUsers[]) => {
      console.log("online_users", data);
      setOnlineUsers(data);
    });
  }, [user]);

  useEffect(() => {
    if (!user || !user._id) return;
    socket.emit("sidebar", user._id);
    socket.on("conversation", (data: IConversation[]) => {
      setAllUser(data);
    });
  }, [user]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.sideBar}>
            <h2 className={styles.title}>Đoạn chat</h2>
            <div className={styles.search}>
              <MagnifyingGlassIcon className="w-6 h-6 flex-shrink-0" />
              <input type="search" placeholder="Search Messenger" />
            </div>
            <div className={styles.chatContainer}>
              {allUser.map((user) => (
                <div
                  className={clsx(
                    styles.chatBox,
                    user.username === userSelected?.username && styles.active
                  )}
                  key={user?._id}
                  role="button"
                  onClick={() => {
                    setUserSelected(user);
                    if (userSelected?.username !== user.username) {
                      setMessages([]);
                    }
                  }}
                >
                  <TooltipProvider delayDuration={100}>
                    <div className={styles.avatar}>
                      <Image
                        src={user?.avatar || "/img/avatar/avatar.jpg"}
                        alt="avatar"
                        width={150}
                        height={150}
                      />
                      {checkUserOnline({
                        onlineUsers,
                        user_id: user?._id as string,
                      }) && (
                        <div className={styles.circle}>
                          <div className={styles.online}></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h3 className={styles.name}>{user?.name}</h3>
                        </TooltipTrigger>
                        <TooltipContent>{user?.name}</TooltipContent>
                      </Tooltip>
                      <p className={styles.msg}>
                        {user?.lastMessage?.sender_id !== user._id
                          ? `Bạn: ${user?.lastMessage?.content}`
                          : user?.lastMessage?.content}
                      </p>
                    </div>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
          {userSelected && (
            <ConversationPage
              userSelected={userSelected}
              onlineUsers={onlineUsers}
              messages={messages}
              setMessages={setMessages}
            />
          )}
        </div>
      </div>
    </>
  );
}
