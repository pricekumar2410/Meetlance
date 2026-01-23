import {
    Alert,
    Box,
    Button,
    Snackbar,
    Typography,
    CircularProgress
} from '@mui/material';
import React, { useState } from 'react';
import { executeCode } from '../codeAPI';

const OutputCode = ({ editorRef, language }) => {

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "error",
    });

    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

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
                <div style={{display: "flex", gap: "7px"}}>
                    <Typography mb={1} color="white" fontSize="large">
                        <b>Output:</b>
                    </Typography>

                    <Button
                        variant="contained"
                        sx={{ color: "green", bgcolor: "gray", mb: "6px"}}
                        onClick={runCode}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? <CircularProgress size={20} />
                            : <b>Run Code</b>
                        }
                    </Button>
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
