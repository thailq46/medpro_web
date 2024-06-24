"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import apiConversation, {IConversationBody} from "@/apiRequest/ApiConversation";
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

const username = ["user666998f28d477b9b06aec7a5", "lqthai123"];

export default function Chat() {
  const {user} = useContext(AppContext);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<IConversationBody[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTextareaScrolled, setIsTextareaScrolled] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

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
      textareaRef.current.style.height = "auto";
    }
    return () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.removeEventListener("input", adjustTextareaHeight);
      }
    };
  }, []);

  const {data: userByUsername} = useQuery({
    queryKey: [QUERY_KEY.GET_USER_BY_USERNAME, userName],
    queryFn: () => apiAuthRequest.getUserByUsername(userName),
    enabled: !!userName,
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

  useEffect(() => {
    if (!conversations) return;
    const newMessages = conversations.pages
      ?.map((page) => {
        return page.payload.data;
      })
      .flat();
    setMessages((prevMessages) => {
      const mergedMessages = [...prevMessages, ...newMessages].reverse();
      const uniqueMessages = Array.from(
        new Map(mergedMessages.map((msg) => [msg._id, msg])).values()
      );
      return uniqueMessages;
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

  return (
    <>
      <div className="pt-5 flex items-center justify-center">
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
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.sideBar}>
            <h2 className={styles.title}>Đoạn chat</h2>
            <div className={styles.search}>
              <MagnifyingGlassIcon className="w-6 h-6 flex-shrink-0" />
              <input type="search" placeholder="Search Messenger" />
            </div>
            <div className={styles.chatContainer}>
              {Array.from({length: 10}).map((_, index) => (
                <div
                  className={clsx(styles.chatBox, index === 0 && styles.active)}
                  key={index}
                >
                  <TooltipProvider delayDuration={100}>
                    <div className={styles.avatar}>
                      <Image
                        src="/img/avatar/avatar.jpg"
                        alt="avatar"
                        width={150}
                        height={150}
                      />
                      <div className={styles.circle}>
                        <div className={styles.online}></div>
                      </div>
                    </div>
                    <div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h3 className={styles.name}>Lê Quang Thái</h3>
                        </TooltipTrigger>
                        <TooltipContent>Lê Quang Thái</TooltipContent>
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
          <div className={styles.main}>
            <nav className={styles.nav}>
              <div className={styles.navAvatar}>
                <Image
                  src="/img/avatar/avatar.jpg"
                  alt="avatar"
                  width={150}
                  height={150}
                />
                <div className={styles.circle}>
                  <div className={styles.online}></div>
                </div>
              </div>
              <div>
                <h3 className={styles.name}>Lê Quang Thái</h3>
                <p className={styles.msg}>Hoạt động 6 phút trước</p>
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
                  {messages.map((conversation) => (
                    <div key={conversation?._id}>
                      <div className="flex">
                        <div
                          className={`bg-blue-400 max-w-[200px] mb-1 p-1 mt-auto ${
                            user?._id === conversation?.sender_id
                              ? "ml-auto"
                              : ""
                          }`}
                        >
                          <p>{conversation.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                        rows={1}
                        dir="auto"
                        className={styles.messageBox}
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
        </div>
      </div>
    </>
  );
}
