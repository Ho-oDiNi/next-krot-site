"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { cn } from "@/shared/lib/cn";
import "./_quill.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => <div>Загрузка редактора...</div>,
});

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
    className = "",
}: QuillEditorProps) => {
    const modules = useMemo(
        () => ({
            toolbar: [
                ["bold", "italic", "underline", "link"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["code-block"],
                ["clean"],
            ],
        }),
        [],
    );

    const formats = [
        "bold",
        "italic",
        "underline",
        "script",
        "code-block",
        "list",
        "link",
    ];

    return (
        <div className={cn("quill-editor-container", className)}>
            <ReactQuill
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                theme="snow"
                placeholder={placeholder}
                readOnly={false}
            />
        </div>
    );
};

export default QuillEditor;
