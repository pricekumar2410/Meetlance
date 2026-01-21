import axios from 'axios'
import { LanguageVersion } from './CodingConstant'

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
})

export const executeCode = async (language, sourceCode) => {
    const response = await API.post("/execute", {
        "language": language,
        "version": LanguageVersion[language],
        "files": [
            {
                "content": sourceCode
            }
        ],
    });
    return response.data;
}
