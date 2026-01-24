import React, { useRef, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import Editor from '@monaco-editor/react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import LangaugeSelector from './langaugeSelector';
import { codeSnippets } from '../CodingConstant';
import OutputCode from './outputCode';


function PracticeCodingComponent() {

    const navigate = useNavigate();
    const [value, setValue] = useState("");
    const editorRef = useRef();
    const [language, setLanguage] = useState("Select");

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (language) => {
        setLanguage(language);
        setValue(codeSnippets[language]);
    };

    return (
        <>
            <Box sx={{ minHeight: "100vh", backgroundColor: "#1f0358", color: "gray", padding: "6px 6px" }}>
                <div style={{ color: "gray", height: "1.7rem", width: "auto", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                    <p style={{ maxWidth: "9rem", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => {
                        navigate("/home");
                    }}><KeyboardBackspaceIcon sx={{ fontSize: "18px" }} /><span>back to dashboard</span></p>
                </div>
                <Stack direction={"row"} spacing={0.5}>
                    <Box width={"65%"}>
                        <LangaugeSelector language={language} onSelect={onSelect} />
                        <Editor
                            height="87.2vh"
                            theme='vs-dark'
                            language={language}
                            value={value}
                            onMount={onMount}
                            defaultValue={codeSnippets[language]}
                            onChange={(value) => setValue(value)}
                            options={{
                                fontSize: 17,      
                                fontFamily: "Fira Code, monospace",
                                lineHeight: 26,
                                minimap: { enabled: false },
                            }}
                        />
                    </Box>
                    <OutputCode editorRef={editorRef} language={language} />
                </Stack>
            </Box>
        </>
    )
}

export default withAuth(PracticeCodingComponent);