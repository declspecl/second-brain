declare global {
    namespace NodeJS {
        interface ProcessEnv {
            OPENAI_API_KEY: string;
            AGENT_BACKEND_URL: string;
        }
    }
}

export {};