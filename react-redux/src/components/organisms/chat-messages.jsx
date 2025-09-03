import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { ScrollArea } from "@/components/atoms/scroll-area";
import { Avatar, AvatarFallback } from "@/components/atoms/avatar";

const ChatMessages = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      username: "Alice",
      content: "Hey everyone! How's the project coming along?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isCurrentUser: false,
    },
    {
      id: 2,
      username: "Bob",
      content: "Pretty good! Just finished the authentication module.",
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      isCurrentUser: false,
    },
    {
      id: 3,
      username: "You",
      content: "Awesome work Bob! I'm working on the chat interface right now.",
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      isCurrentUser: true,
    },
    {
      id: 4,
      username: "Charlie",
      content: "The UI is looking really clean! Love the shadcn components.",
      timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
      isCurrentUser: false,
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        username: "You",
        content: currentMessage,
        timestamp: new Date().toISOString(),
        isCurrentUser: true,
      };
      setMessages([...messages, newMessage]);
      setCurrentMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 1000 * 60) return "just now";
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`;
    if (diff < 1000 * 60 * 60 * 24)
      return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;

    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full max-h-[500px] p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => {
              const showAvatar =
                index === 0 ||
                messages[index - 1].username !== message.username;
              const isConsecutive =
                index > 0 && messages[index - 1].username === message.username;

              if (message.isCurrentUser) {
                // Current user messages - right aligned with background
                return (
                  <div
                    key={message.id}
                    className={`flex justify-end group -mx-2 px-2 py-1 rounded ${
                      isConsecutive ? "mt-1" : "mt-4"
                    }`}
                  >
                    {/* Message Content */}
                    <div className="max-w-[70%] min-w-0">
                      {showAvatar && (
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                          <span className="font-semibold text-sm">
                            {message.username}
                          </span>
                        </div>
                      )}

                      <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm leading-relaxed break-words">
                        {message.content}
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0 ml-3">
                      {showAvatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(message.username)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatTime(message.timestamp).split(" ")[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else {
                // Other users' messages - left aligned
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 group hover:bg-muted/30 -mx-2 px-2 py-1 rounded ${
                      isConsecutive ? "mt-1" : "mt-4"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className={`text-white text-xs ${getAvatarColor(
                              message.username
                            )}`}
                          >
                            {getInitials(message.username)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatTime(message.timestamp).split(" ")[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="min-w-0 max-w-[70%]">
                      {showAvatar && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {message.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      )}

                      <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm text-foreground leading-relaxed break-words inline-block">
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="border-t bg-background p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[40px] resize-none pr-12 bg-muted/50 border-0 focus-visible:ring-1"
              style={{ lineHeight: "1.5" }}
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim()}
            size="sm"
            className="h-10 px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
