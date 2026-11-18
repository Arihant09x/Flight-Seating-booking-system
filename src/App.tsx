import { Toaster } from "sonner";
import { FlightSeatSelectionPage } from "./pages/FlightSeatSelectionPage";

function App() {
  return (
    <>
      <FlightSeatSelectionPage />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: "16px",
            border: "1px solid #27272a",
            background: "#09090b",
            color: "#ffffff",
          },
        }}
        closeButton
      />
    </>
  );
}

export default App;
