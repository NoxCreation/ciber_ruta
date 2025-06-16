import { Field, Input, Text } from "@chakra-ui/react";
import { Control, Controller } from "react-hook-form"

interface Props {
    name: string
    label: string
    control: Control<any>;
    rules: any;
    type:
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
    isRequired?: boolean
    isDisabled?: boolean
    onChange?: (value: any) => void
}

export const InputReactHook = ({
    name,
    label,
    control,
    rules,
    type,
    isRequired = true,
    isDisabled = false,
    onChange
}: Props) => (
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
            <Field.Root>
                <Field.Label style={{ color: "#1f2d59" }}>
                    {label} {isRequired && <Text color={'red'}>*</Text>}
                </Field.Label>
                <Input
                    {...field}
                    type={type}
                    disabled={isDisabled}
                    onChange={(e) => {
                        if (onChange)
                            onChange(e)
                    }}
                />
                <Field.HelperText color={'red'}>{error ? error.message : ""}</Field.HelperText>
            </Field.Root>
        )}
    />
)