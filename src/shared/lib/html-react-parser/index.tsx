import parse from "html-react-parser";

import "@/shared/lib/react-quill/_quill.css";

interface ParsedHTMLProps {
    html: string;
}

const removeDeleteButtons = (html: string): string => {
    return html.replace(
        /<button\b[^>]*class="[^"]*\bql-expert-quote__delete\b[^"]*"[^>]*>[\s\S]*?<\/button>/g,
        "",
    );
};

const removeEditableAttributes = (html: string): string => {
    return html
        .replace(/\scontenteditable="(?:true|false)"/g, "")
        .replace(/\sdata-quill-inner-events-stopped="true"/g, "")
        .replace(/\sdata-quote-blur-sync-bound="true"/g, "")
        .replace(/\sdata-quote-input-bound="true"/g, "")
        .replace(/\sdata-quote-avatar-bound="true"/g, "");
};

const getReadonlyHtml = (html: string): string => {
    return removeEditableAttributes(removeDeleteButtons(html));
};

export const ParsedHTML = ({ html }: ParsedHTMLProps) => {
    return (
        <div className="ql-rendered-content">
            {parse(getReadonlyHtml(html))}
        </div>
    );
};
