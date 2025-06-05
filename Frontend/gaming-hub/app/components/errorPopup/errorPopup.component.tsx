import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface ErrorPopupProps {
    error: string | null;
    onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ error, onClose }) => {
    return (
        <Snackbar
            open={Boolean(error)}
            autoHideDuration={5000}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
                onClose={onClose}
                severity="error"
                sx={{
                    width: "100%",
                    backgroundColor: "#f7a695",
                    // opacity: 20,
                    fontWeight: "bold",
                }}
            >
                {error}
            </Alert>
        </Snackbar>
    );
};

export default ErrorPopup;
