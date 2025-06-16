import { Field, Group, IconButton, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Control, Controller } from "react-hook-form"
import { FiEye, FiEyeOff } from "react-icons/fi";
import { LabelStrongPassword } from "../LabelStrongPassword";
import usePasswordStrength from "@/hooks/usePasswordStrength";

interface Props {
    name: string
    label: string
    control: Control<any>;
    rules: any;
    isRequired?: boolean
    isDisabled?: boolean,
    onChange?: (value: any) => void
}

export const InputPasswordReactHook = ({
    name,
    label,
    control,
    rules,
    isRequired = true,
    isDisabled = false,
    onChange
}: Props) => {
    const [type, set_type] = useState('password' as "password" | "text")
    const toogleClick = () => type == "password" ? set_type("text") : set_type("password")
    const { strength, errors, isValid, handlePasswordChange } = usePasswordStrength();

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <Field.Root>
                    <Field.Label style={{ color: "#1f2d59" }}>
                        {label} {isRequired && <Text color={'red'}>*</Text>}
                    </Field.Label>
                    <Group attached w="full">
                        <Input
                            {...field}
                            type={type}
                            disabled={isDisabled}
                            onChange={(e) => {
                                if (onChange)
                                    onChange(e)
                                handlePasswordChange(e)
                            }}
                        />
                        <IconButton
                            onClick={toogleClick}
                            variant={'outline'} aria-label=''>
                            {type == "text" ? <FiEye /> : <FiEyeOff />}
                        </IconButton>
                    </Group>

                    <LabelStrongPassword
                        strength={strength}
                        errors={errors}
                        isValid={isValid}
                    />

                    <Field.HelperText color={'red'}>{error ? error.message : ""}</Field.HelperText>
                </Field.Root>
            )}
        />
    )
}