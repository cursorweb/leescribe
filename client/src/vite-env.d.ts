/// <reference types="vite/client" />
// import.meta.env

interface ImportMetaEnv {
    readonly VITE_TRANSLATOR_PATH: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}