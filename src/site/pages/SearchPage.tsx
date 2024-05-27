import { Button, Loader, Stack, Text } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { Renderer } from "../../api/types/video";
import { APIContext } from "../../api/provider/APIController";
import { useSearchParams } from "react-router-dom";
import { HorizontalVideoCard } from "../../components/cards/VideoCard";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { IconReload } from "@tabler/icons-react";

export const SearchPage = () => {
    const { api, currentInstance } = useContext(APIContext);
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<Renderer[]>([]);
    const [error, setError] = useState<any | null>(null);

    const q = searchParams.get("q");
    const fetchResults = async () => {
        setLoading(true);
        setError(null);
        try {
            let { key, results } = await api.search(q);
            setResults(results);
        } catch (e) {
            setError(e);
            console.log(e);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [q, currentInstance]);

    return (
        <Stack w="100%" align="center">
            {loading && <Loader />}
            <ErrorMessage
                error={error}
                retry={fetchResults}
            />
            <Text>
                {results.length} results
            </Text>
            {!error && !results.length && (
                <Button
                    variant="light"
                    
                    size="compact-sm"
                    leftSection={<IconReload />}
                    onClick={() => fetchResults()}
                >
                    Retry
                </Button>
            )}
            <Stack w={{ base: "100%", md: "50%" }}>
                {results.filter(x => x.type == "video").map((result, i) => (
                    <HorizontalVideoCard
                        key={i}
                        video={result}
                    />
                ))}
            </Stack>
        </Stack>
    )
};
