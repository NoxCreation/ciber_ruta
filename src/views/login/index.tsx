import { ContentView } from "@/components/ContentView";
import { Login } from "@/components/Login";

export const ViewLogin = () => {
  return (
    <ContentView
      chat={undefined}
      topGradientPercent={10}
      bottomGradientPercent={10}
    >
      <Login />
    </ContentView>
  );
};
