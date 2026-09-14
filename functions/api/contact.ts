export const onRequestPost = async (context:any) => {

    const request = context.request;

    const form = await request.formData();

    const name = form.get("name")?.toString().trim();
    const email = form.get("email")?.toString().trim();
    const phone = form.get("phone")?.toString().trim();
    const message = form.get("message")?.toString().trim();

    if (!name || !email || !phone || !message) {
        return Response.json(
            { success: false, error: "Faltan campos obligatorios." },
            { status: 400 }
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return Response.json(
            { success: false, error: "Email inválido." },
            { status: 400 }
        );
    }

    if (message.length < 20) {
        return Response.json(
            { success: false, error: "Describe mejor tu proyecto." },
            { status: 400 }
        );
    }

    const embed = {
        title: "💼 Nuevo presupuesto recibido",
        color: 0xffffff,

        fields: [
        {
            name: "Cliente",
            value: name,
            inline: true,
        },
        {
            name: "Correo",
            value: email,
            inline: true,
        },
        {
            name: "Teléfono",
            value: phone,
            inline: true,
        },
        {
            name: "Proyecto",
            value: message,
        },
        ],

        timestamp: new Date().toISOString(),
    };

    const webhook = context.env.WEBHOOK_URL;

    const discordResponse = await fetch(webhook, {
        method: "POST",

        headers: {
        "Content-Type": "application/json",
        },

        body: JSON.stringify({
        embeds: [embed],
        }),
    });

    if (!discordResponse.ok) {
        return Response.json(
            { success: false, error: "Discord no respondió." },
            { status: 500 }
        );
    }

    return Response.json({
        success: true,
    });
};