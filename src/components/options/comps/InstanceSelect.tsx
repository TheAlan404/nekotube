import { ActionIcon, Button, Fieldset, Grid, Group, InputBase, Paper, SegmentedControl, Select, Stack, Text, TextInput, Tooltip, UnstyledButton } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { APIContext } from "../../../api/provider/APIController";
import { IconArrowRight, IconReload } from "@tabler/icons-react";
import { Instance } from "../../../api/types/instances";
import { OptionsContext } from "../OptionsContext";
import { InstanceCard } from "../../cards/InstanceCard";

export const InstanceSelect = () => {
    const { setView } = useContext(OptionsContext);
    const {
        currentInstance,
        customInstance,
    } = useContext(APIContext);

    return (
        <Stack w="100%">
            <UnstyledButton
                className="hoverable"
                variant="subtle"
                onClick={() => setView("instanceSelect")}
            >
                <Grid align="center" mx="sm">
                    <Grid.Col span="auto">
                        <InstanceCard
                            instance={currentInstance}
                            isCustom={customInstance}
                            isSelected
                        />
                    </Grid.Col>
                    <Grid.Col span="content">
                        <IconArrowRight />
                    </Grid.Col>
                </Grid>
            </UnstyledButton>
        </Stack>
    );
}
