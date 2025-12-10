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

export const sendDemoRequestEmail = async (data: EmailData): Promise<EmailResponse> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'desenvolvimento@msconsultoriati.com',
        subject: 'Solicitação de Demonstração - Condomínio Fácil',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">🏢 Condomínio Fácil</h1>
              <p style="color: #bfdbfe; margin-top: 10px;">Nova Solicitação de Demonstração</p>
            </div>
            
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #1e3a8a; margin-top: 0;">Dados do Contato</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Nome:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${data.nome}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Email:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${data.email}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Condomínio:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${data.condominio || 'Não informado'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; font-weight: bold; color: #475569;">Telefone/WhatsApp:</td>
                  <td style="padding: 12px; color: #1e293b;">${data.telefone || 'Não informado'}</td>
                </tr>
              </table>
            </div>
            
            <div style="padding: 20px; background: #1e3a8a; text-align: center;">
              <p style="color: #bfdbfe; margin: 0; font-size: 12px;">
                Este email foi enviado automaticamente pelo site Condomínio Fácil
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar email');
    }

    return {
      success: true,
      message: 'Email enviado com sucesso!',
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return {
      success: false,
      message: 'Erro ao enviar email. Tente novamente.',
    };
  }
};

