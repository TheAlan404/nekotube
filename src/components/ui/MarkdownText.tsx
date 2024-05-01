import { TypographyStylesProvider } from "@mantine/core";

export const MarkdownText = ({
    text,
}: {
    text: string;
}) => {
    return (
        <TypographyStylesProvider>
            <div
                dangerouslySetInnerHTML={{
                    __html: text.replaceAll("\n", "<br>"),
                }}
            />
        </TypographyStylesProvider>
    );
};
