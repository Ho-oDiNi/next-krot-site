"use client";

import dynamic from "next/dynamic";
import { memo, useCallback, useMemo } from "react";

import "react-quill-new/dist/quill.snow.css";

import { cn } from "@/shared/lib/cn";

import "./_quill.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => <div>Загрузка редактора...</div>,
});

const QUILL_FORMATS = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "link",
    "list",
    "indent",
    "align",
    "color",
    "background",
    "size",
    "script",
    "image",
    "video",
    "code-block",
];

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

interface QuillRange {
    index: number;
    length: number;
}

interface ImageHandlerContext {
    quill: {
        getSelection: (focus?: boolean) => QuillRange | null;
        insertEmbed: (
            index: number,
            type: "image",
            value: string,
            source: "user",
        ) => void;
        setSelection: (index: number, length?: number) => void;
    };
}

const uploadEditorImage = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
    });

    const result = (await response.json()) as {
        url?: string;
        message?: string;
    };

    if (!response.ok || !result.url) {
        throw new Error(result.message ?? "Не удалось загрузить изображение");
    }

    return result.url;
};

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

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ size: ["small", false, "large", "huge"] }],

                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],

                    [{ script: "sub" }, { script: "super" }],

                    ["blockquote", "code-block"],

                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ indent: "-1" }, { indent: "+1" }],

                    [{ align: [] }],

                    ["link", "image", "video"],

                    ["clean"],
                ],
                handlers: {
                    image: function (this: ImageHandlerContext) {
                        const input = document.createElement("input");

                        input.type = "file";
                        input.accept = "image/*";
                        input.click();

                        input.onchange = async () => {
                            const file = input.files?.[0];

                            if (!file) {
                                return;
                            }

                            try {
                                const imageUrl = await uploadEditorImage(file);
                                const range = this.quill.getSelection(true);
                                const insertIndex = range?.index ?? 0;

                                this.quill.insertEmbed(
                                    insertIndex,
                                    "image",
                                    imageUrl,
                                    "user",
                                );

                                this.quill.setSelection(insertIndex + 1);
                            } catch (error) {
                                console.error(error);
                                alert("Не удалось загрузить изображение");
                            }
                        };
                    },
                },
            },
        }),
        [],
    );

    return (
        <div className={cn("quill-editor-container", className)}>
            <ReactQuill
                value={value || ""}
                onChange={handleChange}
                modules={modules}
                formats={QUILL_FORMATS}
                theme="snow"
                placeholder={placeholder}
            />
        </div>
    );
};

export default memo(QuillEditor);
