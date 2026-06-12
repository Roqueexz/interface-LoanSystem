import type { ReactNode } from "react";
import Navegacao from "../Navegacao/Navegacao";
import Rodape from "../Rodape/Rodape";

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navegacao />

      <main className="flex-1">
        {children}
      </main>

      <Rodape />
    </div>
  );
}

export default Layout;