import {
    Alert,
    Box,
    Button,
    Snackbar,
    Typography,
    CircularProgress,
    Tooltip
} from '@mui/material';
import React, { useState } from 'react';
import { executeCode } from '../codeAPI';
import Confetti from 'react-confetti-boom';

const OutputCode = ({ editorRef, language }) => {

    const [input, setInput] = useState("");
    const [showInput, setShowInput] = useState(false);

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "error",
    });

    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [success, setSuccess] = useState(false);

    // 🔥 Detect input-based code
    const hasInputCode = (code) => {
        return (
            // Python
            code.includes("input(") ||

            // C / C++
            code.includes("cin") ||
            code.includes("scanf") ||

            // Java
            code.includes("Scanner") ||
            code.includes("nextInt") ||
            code.includes("nextLine") ||

            // JavaScript / TypeScript (Node.js)
            code.includes("fs.readFileSync") ||
            code.includes("readline") ||

            // C#
            code.includes("Console.ReadLine") ||

            // PHP
            code.includes("readline") ||
            code.includes("fgets") ||

            // SQL (generally no input, but keep safe)
            code.includes("?") // placeholder queries
        );
    };

    const runCode = async () => {
        const sourceCode = editorRef.current?.getValue();
        if (!sourceCode) return;

        // 👇 Check if input required
        if (hasInputCode(sourceCode) && !input) {
            setShowInput(true);

            setToast({
                open: true,
                message: "Please enter input first",
                severity: "warning",
            });
            return;
        }

        try {
            setIsLoading(true);
            setIsError(false);

            const result = await executeCode(language, sourceCode, input);

            if (result.output.includes("error") || result.output.includes("Error")) {
                setIsError(true);
            }

            setOutput(result.output.split("\n"));

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            // 🔄 Reset input after run
            setInput("");
            setShowInput(false);

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

                {/* 🔥 Input Box (only when needed) */}
                {showInput && (
                    <textarea
                        placeholder="Enter input and press Enter..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                runCode();
                            }
                        }}
                        style={{
                            width: "100%",
                            height: "10vh",
                            marginBottom: "5px",
                            background: "#1c1c1d",
                            color: "white",
                            border: "1px solid #333",
                            padding: "10px"
                        }}
                    />
                )}

                <Box
                    height={showInput ? "76vh" : "87.2vh"}
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