import { AppProviders } from "@/AppProviders";
import ChatUI from "@/components/organisms/ChatUi";

export default function App() {
  return (
    <AppProviders>
      <ChatUI />
    </AppProviders>
  );
}
