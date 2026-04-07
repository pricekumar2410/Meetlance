import {
    Alert,
    Box,
    Button,
    Snackbar,
    Typography,
    CircularProgress,
    Tooltip
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import React, { useState } from 'react';
import { executeCode } from '../codeAPI';
import Confetti from 'react-confetti-boom';

const OutputCode = ({ editorRef, language }) => {

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "error",
    });

    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [success, setSuccess] = useState(false);

    const runCode = async () => {
        const sourceCode = editorRef.current?.getValue();
        if (!sourceCode) return;

        try {
            setIsLoading(true);
            setIsError(false);

            const { run: result } = await executeCode(language, sourceCode);

            if (result.stderr) {
                setIsError(true);
                setOutput(result.stderr.split("\n"));
            }

            else {
                setOutput(
                    (result.stdout || result.output || "").split("\n")
                );
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }

        } catch (e) {
            console.log(e);
            setToast({
                open: true,
                message: e.message || "Unable to run code",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Box width="35%">
                <div style={{ display: "flex", gap: "7px" }}>
                    <Typography mb={1} color="white" fontSize="large">
                        <b>Output:</b>
                    </Typography>

                    <Tooltip
                        title={language === "Select" ? "Please select a language first" : ""}
                        arrow
                        disableHoverListener={language !== "Select"}
                    >
                        <span>
                            <Button
                                variant="contained"
                                sx={{
                                    color: "white",
                                    bgcolor: "green",
                                    mb: "6px",
                                    opacity: language === "Select" ? 0.6 : 1,
                                    cursor: language === "Select" ? "not-allowed" : "pointer",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        bgcolor: language === "Select" ? "#ff6b6b" : "#45a049",
                                        transform: language === "Select" ? "scale(1)" : "scale(1.05)"
                                    }
                                }}
                                onClick={() => {
                                    if (language !== "Select") {
                                        runCode();
                                    }
                                }}
                                disabled={false}
                            >
                                {isLoading
                                    ? <CircularProgress size={20} />
                                    : <b>Run Code</b>
                                }
                            </Button>
                        </span>
                    </Tooltip>
                    {success && (
                        <Confetti
                            mode='boom'
                            width={window.innerWidth}
                            height={window.innerHeight}
                            particleCount={300}
                            gravity={0.3}
                            initialVelocityX={{ min: -20, max: 20 }}
                            initialVelocityY={{ min: -25, max: 5 }}
                            colors={["#22C55E", "#3B82F6", "#FACC15", "#F97316"]}
                            recycle={false}
                            confettiSource={{
                                x: window.innerWidth / 2,
                                y: window.innerHeight / 2,
                                w: 0,
                                h: 0,
                            }}
                        />
                    )}
                </div>

                <Box
                    height="87.2vh"
                    p={2}
                    border="2px solid"
                    borderRadius="4px"
                    bgcolor={"#1c1c1d"}
                    borderColor={
                        isError ? "red" : output ? "green" : "#333"
                    }
                    color={isError ? "red" : "white"}
                    sx={{
                        overflowY: "auto",
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace"
                    }}
                >
                    {output
                        ? output.map((line, i) => (
                            <Typography key={i} fontFamily="monospace">
                                {line}
                            </Typography>
                        ))
                        : 'Click "Run Code" to see the output here'}
                </Box>
            </Box>

            <Snackbar
                open={toast.open}
                autoHideDuration={6000}
                onClose={() =>
                    setToast({ ...toast, open: false })
                }
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={toast.severity} variant="filled">
                    {toast.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default OutputCode;