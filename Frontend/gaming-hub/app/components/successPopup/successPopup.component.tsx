import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface SuccessPopupProps {
    success: string | null;
    onClose: () => void;
}

const SuccesPopup: React.FC<SuccessPopupProps> = ({ success, onClose }) => {
    return (
        <Snackbar
            open={Boolean(success)}
            autoHideDuration={5000}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
                onClose={onClose}
                severity="success"
                sx={{
                    width: "100%",
                    // backgroundColor: "#f7a695",
                    // opacity: 20,
                    fontWeight: "bold",
                }}
            >
                {success}
            </Alert>
        </Snackbar>
    );
};

export default SuccesPopup;
