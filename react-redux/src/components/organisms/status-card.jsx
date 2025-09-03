import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { useSelector } from "react-redux";

export default function StatusCard() {
  const connected = useSelector((state) => state.connection.connected);

  return (
    <Card className="w-full h-full rounded-xl shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Status</span>
          <Badge
            variant={connected ? "default" : "destructive"}
            className="px-3 py-1 text-sm rounded-full"
          >
            {connected ? "Connected" : "Not Connected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <p className="text-lg font-medium text-muted-foreground">
          {connected ? "You are online 🎉" : "You are offline 🚫"}
        </p>
      </CardContent>
    </Card>
  );
}
