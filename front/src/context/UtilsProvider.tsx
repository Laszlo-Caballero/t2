import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

interface Utils {
  temperatura: number[];
  vibracion: number[];
  tiempo: number[];
}

interface UtilsContextProps {
  data: Utils;
  setData: React.Dispatch<React.SetStateAction<Utils>>;
}

const UtilsContext = createContext<UtilsContextProps>({
  data: {
    temperatura: [],
    vibracion: [],
    tiempo: [],
  },
  setData: () => {},
});

export default function UtilsProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<Utils>({
    temperatura: [],
    vibracion: [],
    tiempo: [],
  });

  return (
    <UtilsContext.Provider value={{ data, setData }}>
      {children}
    </UtilsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUtils() {
  const context = useContext(UtilsContext);
  if (!context) {
    throw new Error("useUtils must be used within a UtilsProvider");
  }
  return context;
}
