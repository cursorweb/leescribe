import { useEffect, useRef } from "react";

export function RichTextCont({ content }: React.PropsWithChildren & { content: Node[] }) {
    const divElRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        for (const x of content) {
            divElRef.current!.appendChild(x);
        }
    });

    return (<>
        <div ref={divElRef} />
    </>);
}