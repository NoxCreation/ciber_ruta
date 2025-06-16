/*
    ESTE COMPONENTE GENERA UN FORMULARIO DE FORMA DINAMICA EN POCAS LINEAS DE CODIGO Y CON LAS VALIDACIONES
    NECESARIAS PARA SU FUNCIONAMIENTO. 
*/

import { Button, For, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { InputReactHook } from "../InputReactHook";
import { InputPasswordReactHook } from "../InputPasswordReactHook";
import { TabSelectReactHook } from "../TabSelectReactHook";

interface Props {
    fields: Array<{
        name: string,
        label: string,
        fieldType: 'input' | 'password' | 'tabSelect'
        inputType?:
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
        isRequired: boolean,
        options?: Array<{
            label: string
            value: string
        }>
    }>
    buttonSubmitName?: string
    onSubmit: (data: any) => void
    isLoading?: boolean
}

export const FormControl = ({
    fields,
    buttonSubmitName = "Submit",
    isLoading = false,
    onSubmit
}: Props) => {

    const { control, handleSubmit, setValue } = useForm({
        defaultValues: fields.map(e => e.name).reduce((acc: any, key) => {
            acc[key] = "";
            return acc;
        }, {})
    })

    return (
        <form action="POST" onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="6">
                <For each={fields}>
                    {(item, index) => (
                        <span key={index}>
                            {item.fieldType == 'input' && <InputReactHook
                                control={control}
                                name={item.name}
                                label={item.label}
                                type={item.inputType as any}
                                rules={item.isRequired ? {
                                    required: 'Este campo es requerido'
                                } : {}}
                                isRequired={item.isRequired}
                                isDisabled={isLoading}
                                onChange={e => setValue(item.name, e.target.value)}
                            />}

                            {item.fieldType == 'password' && <InputPasswordReactHook
                                control={control}
                                name={item.name}
                                label={item.label}
                                rules={item.isRequired ? {
                                    required: 'Este campo es requerido'
                                } : {}}
                                isRequired={item.isRequired}
                                isDisabled={isLoading}
                                onChange={e => setValue(item.name, e.target.value)}
                            />}

                            {item.fieldType == 'tabSelect' && <TabSelectReactHook
                                control={control}
                                name={item.name}
                                label="Registrame Como"
                                rules={item.isRequired ? {
                                    required: 'Este campo es requerido'
                                } : {}}
                                isRequired={item.isRequired}
                                isDisabled={isLoading}
                                options={item.options}
                                onChange={e => setValue(item.name, e.target.value)}
                            />}
                        </span>
                    )}
                </For>
                <Button loading={isLoading} type="submit" style={{ background: "#283c77" }}>
                    {buttonSubmitName}
                </Button>
            </Stack>
        </form>
    )
}