import { Stack } from "@mantine/core";
import { useRouteError } from "react-router-dom";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

export const ErrorPage = () => {
    const error = useRouteError();

    return (
        <Stack>
            <ErrorMessage
                error={error}
            />
        </Stack>
    )
};
