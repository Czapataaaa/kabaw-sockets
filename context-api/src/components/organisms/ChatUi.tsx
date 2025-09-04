import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { ScrollArea } from "@/components/atoms/scroll-area";
import { Send, Wifi, WifiOff, Trash } from "lucide-react";
import {
  useWebSocketConnection,
  useWebSocketMessages,
} from "@/hooks/useWebSocket";

export default function ChatUI() {
  const [messageInput, setMessageInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [channelInput, setChannelInput] = useState("general");

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  // Hook: connection state + methods
  const {
    isConnected,
    connectionStatus,
    username,
    channel,
    connect,
    disconnect,
  } = useWebSocketConnection();

  // Hook: message state + methods
  const { messages, sendMessage, clearMessages } = useWebSocketMessages();

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length]);

  const handleConnect = () => {
    if (!nameInput.trim() || !channelInput.trim()) return;
    connect(nameInput.trim(), channelInput.trim());
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-3 gap-6 h-[600px]">
        {/* Connection Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Channel</label>
              <Input
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                placeholder="Enter channel"
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleConnect}
                disabled={isConnected}
              >
                Connect
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={disconnect}
                disabled={!isConnected}
              >
                Disconnect
              </Button>
            </div>

            {/* Status Section */}
            <div className="mt-6">
              <div className="bg-muted p-3 rounded-lg text-center">
                <h3 className="font-medium mb-2">Status</h3>
                <Badge
                  variant={isConnected ? "default" : "secondary"}
                  className="flex items-center justify-center gap-1"
                >
                  {isConnected ? (
                    <Wifi className="w-3 h-3" />
                  ) : (
                    <WifiOff className="w-3 h-3" />
                  )}
                  {connectionStatus}
                </Badge>
                {username && (
                  <p className="mt-2 text-xs opacity-75">
                    Connected as <span className="font-medium">{username}</span>{" "}
                    {channel && `in #${channel}`}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="col-span-2 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>Chat Messages</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearMessages}
                disabled={messages.length === 0}
                title="Clear messages"
              >
                <Trash className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-full flex flex-col">
            <ScrollArea className="flex-1 px-4 max-h-[60vh]">
              <div className="space-y-3 py-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.type === "system" ? (
                      <div className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {message.content}
                        </Badge>
                      </div>
                    ) : (
                      <div
                        className={`flex ${
                          message.username === username
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.username === username
                              ? "bg-primary text-primary-foreground ml-4"
                              : "bg-muted mr-4"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {message.username}
                            </span>
                            <span className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={endOfMessagesRef} />
              </div>
            </ScrollArea>

            <div className="flex-shrink-0 p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={!isConnected}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!isConnected || !messageInput.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
