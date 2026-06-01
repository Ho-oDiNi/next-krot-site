"use client";

import dynamic from "next/dynamic";
import { memo, useCallback } from "react";

import "react-quill-new/dist/quill.snow.css";

import { cn } from "@/shared/lib/cn";

import "./_quill.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => <div>Загрузка редактора...</div>,
});

const QUILL_MODULES = {
    toolbar: [
        ["bold", "italic", "underline", "link"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["code-block"],
        ["clean"],
    ],
};

const QUILL_FORMATS = [
    "bold",
    "italic",
    "underline",
    "link",
    "list",
    "code-block",
];

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const QuillEditor = ({
    value,
    onChange,
    placeholder = "Введите текст...",
    className,
}: QuillEditorProps) => {
    const handleChange = useCallback(
        (content: string) => {
            onChange(content);
        },
        [onChange],
    );

    return (
        <div className={cn("quill-editor-container", className)}>
            <ReactQuill
                value={value || ""}
                onChange={handleChange}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                theme="snow"
                placeholder={placeholder}
            />
        </div>
    );
};

export default memo(QuillEditor);
