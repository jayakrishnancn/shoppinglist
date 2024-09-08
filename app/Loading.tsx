import { Backdrop, Box } from "@mui/material";
import { useMetadata } from "./contexts/metadata";
import useAuth from "./firebase/useAuth";

export default function Loading() {
  const { isLoading } = useMetadata();
  const { loading } = useAuth();
  return (
    <Box zIndex={1000} position="fixed">
      <Backdrop open={isLoading || loading}>
        <span className="loader"></span>
      </Backdrop>
    </Box>
  );
}
