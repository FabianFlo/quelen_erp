interface LoginRequest {
    userId: string;
    password: string;
}

interface LoginResponse {
    usuario: string;
    tipo: string;
}

export async function login({ userId, password }: { userId: string; password: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
    });

    if (!res.ok) {
        throw new Error("Credenciales incorrectas o error de conexión.");
    }

    return res.json(); // { usuario, tipo }
}

