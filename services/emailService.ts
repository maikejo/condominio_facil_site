// Serviço para envio de emails via SendGrid

interface EmailData {
  nome: string;
  email: string;
  condominio: string;
  telefone: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
}

export const sendEmailViaSendGrid = async (data: EmailData): Promise<EmailResponse> => {
  try {
    // Em desenvolvimento, usa a porta 3001 do servidor Express
    // Em produção, usa a API route do Vercel
    const apiUrl = import.meta.env.DEV 
      ? 'http://localhost:3001/api/send-email' 
      : '/api/send-email';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao enviar email');
    }

    return {
      success: true,
      message: 'Email enviado com sucesso!',
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao enviar email. Tente novamente.',
    };
  }
};

