"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import apiConversation, {
  IConversationBody,
  IGetUserChatWithMeBody,
} from "@/apiRequest/ApiConversation";
import {AppContext} from "@/app/(home)/AppProvider";
import {CirclePlusIcon, PaperPlaneIcon, SpinnerIcon} from "@/components/Icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import socket from "@/lib/socket";
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import {
  FormEvent,
  UIEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Chat.module.scss";

dayjs.extend(relativeTime);

interface IOnlineUsers {
  user_id: string;
  last_online: Date | null;
}

export default function ChatTest() {
  const {user} = useContext(AppContext);
  const [value, setValue] = useState<string>("");
  const [messages, setMessages] = useState<IConversationBody[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<IOnlineUsers[]>([]);
  const [userSelected, setUserSelected] =
    useState<IGetUserChatWithMeBody | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTextareaScrolled, setIsTextareaScrolled] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 30);
  };

  const {data: userByUsername} = useQuery({
    queryKey: [QUERY_KEY.GET_USER_BY_USERNAME, userSelected?.username],
    queryFn: () =>
      apiAuthRequest.getUserByUsername(userSelected?.username as string),
    enabled: !!userSelected?.username,
  });

  const {
    data: conversations,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      QUERY_KEY.GET_CONVERSATION_BY_RECEIVER_ID,
      {receiver_id: userByUsername?.payload?.data?._id as string},
    ],
    queryFn: ({pageParam}) => {
      return apiConversation.getByReceiverId({
        receiver_id: userByUsername?.payload?.data?._id as string,
        params: {limit: 10, page: pageParam},
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (
        lastPage.payload.meta.total_page === lastPage.payload.meta.current_page
      ) {
        return undefined;
      }
      return (lastPage.payload.meta.current_page as number) + 1;
    },
    enabled: !!userByUsername?.payload?.data?._id,
  });

  const {data: conversationsMe} = useQuery({
    queryKey: [QUERY_KEY.GET_CONVERSATION_OF_ME],
    queryFn: () => apiConversation.getConversationsChatWithMe(),
  });

  useEffect(() => {
    const adjustTextareaHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        setIsTextareaScrolled(textarea.scrollHeight >= 53);
      }
    };
    if (textareaRef.current) {
      textareaRef.current.addEventListener("input", adjustTextareaHeight);
    }
    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener("input", adjustTextareaHeight);
      }
    };
  }, []);

  useEffect(() => {
    if (!conversations) return;
    const newConversations = conversations.pages
      ?.map((conversation) => {
        return conversation.payload.data;
      })
      .flat();
    setMessages((prevConversations) => {
      const mergedConversations = [
        ...prevConversations,
        ...newConversations,
      ].reverse();
      const uniqueConversations = Array.from(
        new Map(mergedConversations.map((msg) => [msg._id, msg])).values()
      );
      return uniqueConversations;
    });
    if (isFirstLoad && chatContainerRef) {
      scrollToBottom();
      setIsFirstLoad(false);
    }
  }, [conversations, isFirstLoad]);

  useEffect(() => {
    if (!user || !user._id) return;

    socket.on("receive_message", (data: any) => {
      console.log(data);
      const {payload} = data;
      setMessages((message) => [...message, payload]);
      scrollToBottom();
    });

    socket.on("connect_error", (err: any) => {
      console.log(err.data);
    });

    socket.on("disconnect", (reason) => {
      console.log(reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!user || !user._id) return;
    socket.on("online_users", (data: IOnlineUsers[]) => {
      console.log("online_users", data);
      setOnlineUsers(data);
    });
  }, [user]);

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const conversation = {
      content: value,
      sender_id: user?._id,
      receiver_id: userByUsername?.payload?.data?._id,
    };
    socket.emit("send_message", {
      payload: conversation,
    });
    setValue("");
    setMessages((message) => [
      ...message,
      {
        ...conversation,
        _id: new Date().getTime().toString(),
      },
    ]);
    scrollToBottom();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      setIsTextareaScrolled(false);
    }
  };

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    if (element.scrollTop === 0 && hasNextPage) {
      fetchNextPage();
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({top: 1, behavior: "smooth"});
      }, 0);
    }
  };

  const checkUserOnline = (user_id: string) => {
    if (!onlineUsers) return false;
    return onlineUsers.some(
      (user) => user.user_id === user_id && user.last_online === null
    );
  };

  const renderUserStatus = (user_id: string) => {
    const user = onlineUsers.find((user) => user.user_id === user_id);
    if (user) {
      if (user.last_online) {
        const lastOnline = dayjs(user.last_online).fromNow();
        return `Last online: ${lastOnline}`;
      }
      return "Online";
    }
    return "Offline";
  };

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
              {conversationsMe?.payload?.data?.map((user) => (
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
                      {checkUserOnline(user?._id as string) && (
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
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestiae, autem provident suscipit porro cupiditate
                        mollitia voluptate, debitis cumque corporis ipsam sed
                        adipisci consectetur ipsum! Unde consequuntur alias id
                        deserunt voluptatum?
                      </p>
                    </div>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
          {userSelected && (
            <div className={styles.main}>
              <nav className={styles.nav}>
                <div className={styles.navAvatar}>
                  <Image
                    src={userSelected?.avatar || "/img/avatar/avatar.jpg"}
                    alt="avatar"
                    width={150}
                    height={150}
                  />
                  {checkUserOnline(userSelected?._id as string) && (
                    <div className={styles.circle}>
                      <div className={styles.online}></div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className={styles.name}>{userSelected?.name}</h3>
                  <p className={styles.msg}>
                    {renderUserStatus(userSelected?._id as string)}
                  </p>
                </div>
              </nav>
              <div
                className={styles.messageDisplay}
                onScroll={handleScroll}
                ref={chatContainerRef}
              >
                {status === "pending" ? (
                  <p>Loading....</p>
                ) : status === "error" ? (
                  <p>Error: {error.message}</p>
                ) : (
                  <>
                    {isFetchingNextPage && (
                      <div className="flex items-center justify-center">
                        <SpinnerIcon className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                    <div className="flex flex-col gap-2 py-2 mx-2">
                      {messages.map((conversation) => (
                        <div
                          className={clsx(
                            "p-1 py-1 rounded w-fit max-w-[380px] md:max-w-sm lg:max-w-md",
                            user?._id === conversation?.sender_id
                              ? "ml-auto bg-teal-100"
                              : "bg-white"
                          )}
                          key={conversation._id}
                        >
                          <p className="px-2">{conversation.content}</p>
                          <p className="text-xs ml-auto w-fit">
                            {dayjs(conversation.created_at).format("hh:mm")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className={styles.footer}>
                <form onSubmit={send} className="w-full">
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center">
                      <CirclePlusIcon className="w-6 h-6" />
                    </div>
                    <div className={styles.inputMsg}>
                      <div className="flex flex-1 w-full">
                        <textarea
                          ref={textareaRef}
                          placeholder="Aa"
                          dir="auto"
                          rows={1}
                          className={styles.messageBox}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                      </div>
                      <CirclePlusIcon
                        className={clsx(
                          "w-6 h-6",
                          isTextareaScrolled && "self-end"
                        )}
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex items-center justify-center mr-3 p-2 cursor-pointer"
                    >
                      <PaperPlaneIcon className="w-5 h-5 text-textSecondary" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
