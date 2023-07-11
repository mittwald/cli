import React, { ReactElement } from "react";
import { Box, Text } from "ink";
import { useRenderContext } from "../context.js";
import { RenderJson } from "../json/RenderJson.js";

interface Props<TData> {
    data: TData[];
    columns?: string[];
}

// TODO: Dynamic columns and typed data
export function Table<TData>(props: Props<any>): ReactElement {
    const { columns, data } = props;

    const { renderAsJson } = useRenderContext();

    if (renderAsJson) {
        return <RenderJson name="data" data={data} />;
    }

    return (
        <Box flexDirection="column" margin={1} gap={0} padding={0}>
            <Box margin={0} gap={1} padding={0}>
                <Box
                    borderStyle="single"
                    minWidth={38}
                    padding={0}
                    margin={0}
                    borderBottom
                    borderTop={false}
                    borderLeft={false}
                    borderRight={false}
                >
                    <Text bold>ID</Text>
                </Box>

                <Box
                    borderStyle="single"
                    width="50%"
                    padding={0}
                    margin={0}
                    borderBottom
                    borderTop={false}
                    borderLeft={false}
                    borderRight={false}
                >
                    <Text bold>Name</Text>
                </Box>

                <Box
                    width="40%"
                    borderStyle="single"
                    padding={0}
                    margin={0}
                    borderBottom
                    borderTop={false}
                    borderLeft={false}
                    borderRight={false}
                >
                    <Text bold>Status</Text>
                </Box>
            </Box>
            <Box flexDirection="column">
                {props.data.map((p) => (
                    <Box key={p.id} gap={1}>
                        <Box minWidth={38} padding={0}>
                            <Text>{p.id}</Text>
                        </Box>

                        <Box width="50%" padding={0}>
                            <Text>{p.description}</Text>
                        </Box>

                        <Box width="40%" padding={0}>
                            <Text>{p.readiness}</Text>
                        </Box>
                    </Box>
                ))}
            </Box>
            <Box marginTop={5}>
                <Text dimColor>Columns: {JSON.stringify(props.columns)}</Text>
            </Box>
        </Box>
    );
}
