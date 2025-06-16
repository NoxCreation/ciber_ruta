// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Manager } from "@/utils/engine";
import { generateHash } from "@/utils/hash";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    detail: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    if (req.method != "POST")
        return res.status(400).json({ detail: "Método no permitido" });

    const {
        first_name,
        last_name,
        email,
        role,
        password,
        confirm_password
    } = req.body

    // Comprobando que sean iguales los password
    if (password != confirm_password)
        return res.status(400).json({ detail: "La contraseña de confirmación no coincide" });

    // Generando hash
    const password_hash = await generateHash(password)

    // Guardando modelo
    await Manager().User.create({
        first_name,
        last_name,
        email,
        role,
        password_hash,
    })

    res.status(200).json({ detail: "Usuario registrado con éxito." });
}
