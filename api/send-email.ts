// API Route para envio de emails via SendGrid
// Funciona automaticamente no Vercel ou pode ser adaptada para outros serviços

interface EmailRequestBody {
  to: string;
  subject: string;
  html: string;
}

export default async function handler(req: Request): Promise<Response> {
  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body: EmailRequestBody = await req.json();
    const { to, subject, html } = body;

    // Validação básica
    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: 'Campos obrigatórios ausentes' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@condominifacil.com.br';

    if (!SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY não configurada');
      return new Response(JSON.stringify({ error: 'Configuração de email não encontrada' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Envia o email via SendGrid API
    const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: subject,
          },
        ],
        from: {
          email: FROM_EMAIL,
          name: 'Condomínio Fácil',
        },
        content: [
          {
            type: 'text/html',
            value: html,
          },
        ],
      }),
    });

    if (!sendgridResponse.ok) {
      const errorText = await sendgridResponse.text();
      console.error('SendGrid error:', errorText);
      return new Response(JSON.stringify({ error: 'Falha ao enviar email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Email enviado com sucesso!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no handler:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Config para Vercel
export const config = {
  runtime: 'edge',
};

