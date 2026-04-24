import axios from "axios";

const API = axios.create({
    baseURL: "https://ce.judge0.com"
});

// 🔥 language mapping (IMPORTANT)
const languageMap = {
    python: 71,
    javascript: 63,
    typescript: 74,
    java: 62,
    c: 50,
    cpp: 54,
    csharp: 51,
    sql: 82,
    php: 68
};

export const executeCode = async (language, sourceCode, input) => {
    try {
        // 1️⃣ submit code
        const submit = await API.post(
            "/submissions?base64_encoded=false&wait=false",
            {
                source_code: sourceCode,
                language_id: languageMap[language],
                stdin: input
            }
        );

        const token = submit.data.token;

        // 2️⃣ poll for result
        let result;

        while (true) {
            const res = await API.get(
                `/submissions/${token}?base64_encoded=false`
            );

            if (res.data.status.id <= 2) {
                // still processing
                await new Promise((r) => setTimeout(r, 1000));
                continue;
            }

            result = res.data;
            break;
        }

        return {
            output:
                result.stdout ||
                result.stderr ||
                result.compile_output ||
                "No output"
        };

    } catch (error) {
        return {
            output: "Error running code"
        };
    }
};