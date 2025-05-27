import { ContentView } from "@/components/ContentView";
import { Login } from "@/components/Login";

export const ViewLogin = () => {
  return (
    <ContentView
      chat={undefined}
      topGradientPercent={0}
      bottomGradientPercent={0}
    >
      <Login />
    </ContentView>
  );
};
