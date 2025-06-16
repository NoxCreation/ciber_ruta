import { Field, SegmentGroup, Text } from "@chakra-ui/react";
import { Control, Controller } from "react-hook-form"

interface Props {
    name: string
    label: string
    control: Control<any>;
    rules: any;
    isRequired?: boolean
    isDisabled?: boolean
    options?: Array<{
        label: string
        value: string
    }>
    onChange?: (value: any) => void
}

export const TabSelectReactHook = ({
    name,
    label,
    control,
    rules,
    isRequired = true,
    isDisabled = false,
    options,
    onChange
}: Props) => (
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ fieldState: { error } }) => (
            <Field.Root >
                <Field.Label style={{ color: "#1f2d59" }}>
                    {label} {isRequired && <Text color={'red'}>*</Text>}
                </Field.Label>
                <SegmentGroup.Root defaultValue="React" w={'100%'} onChange={onChange} disabled={isDisabled}>
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Items items={options as any} w={'100%'} />
                </SegmentGroup.Root>
                <Field.HelperText color={'red'}>{error ? error.message : ""}</Field.HelperText>
            </Field.Root>
        )}
    />
)