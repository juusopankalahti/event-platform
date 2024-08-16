import { CircularProgress } from "@mui/material";

const LoadingScreen = () => {
  return (
    <main className="flex min-h-screen flex-col items-center p-16 justify-center">
      <CircularProgress style={{ color: "#991b1b" }} />
    </main>
  );
};

export default LoadingScreen;
