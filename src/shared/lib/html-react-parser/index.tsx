import parse from "html-react-parser";

interface ParsedHTMLProps {
    html: string;
}

export const ParsedHTML = ({ html }: ParsedHTMLProps) => {
    return <>{parse(html)}</>;
};
