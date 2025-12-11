// Servidor Express para envio de emails via SendGrid
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota para envio de email
app.post('/api/send-email', async (req, res) => {
  try {
    const { nome, email, condominio, telefone } = req.body;

    // Validação
    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@condominiofacil.com.br';

    if (!SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY não configurada no .env');
      return res.status(500).json({ error: 'API Key do SendGrid não configurada' });
    }

    console.log('📧 Enviando email para:', 'desenvolvimento@msconsultoriati.com');
    console.log('📝 Dados:', { nome, email, condominio, telefone });

    // HTML do email
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🏢 Condomínio Fácil</h1>
          <p style="color: #bfdbfe; margin-top: 8px; font-size: 14px;">Nova Solicitação de Demonstração</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #1e3a8a; margin-top: 0; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">📋 Dados do Contato</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 14px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569; width: 140px;">👤 Nome:</td>
              <td style="padding: 14px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 15px;">${nome}</td>
            </tr>
            <tr>
              <td style="padding: 14px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">📧 Email:</td>
              <td style="padding: 14px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 15px;">
                <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">🏢 Condomínio:</td>
              <td style="padding: 14px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 15px;">${condominio || 'Não informado'}</td>
            </tr>
            <tr>
              <td style="padding: 14px 12px; font-weight: 600; color: #475569;">📱 Telefone:</td>
              <td style="padding: 14px 12px; color: #1e293b; font-size: 15px;">${telefone || 'Não informado'}</td>
            </tr>
          </table>
        </div>
        
        <div style="padding: 20px; background: #1e3a8a; text-align: center; border-radius: 0 0 12px 12px;">
          <p style="color: #bfdbfe; margin: 0; font-size: 12px;">
            Este email foi enviado automaticamente pelo site Condomínio Fácil
          </p>
        </div>
      </div>
    `;

    // Envia via SendGrid
    const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'desenvolvimento@msconsultoriati.com' }],
          subject: `🏢 Nova Demonstração: ${nome} - ${condominio || 'Condomínio'}`,
        }],
        from: {
          email: FROM_EMAIL,
          name: 'Condomínio Fácil',
        },
        reply_to: {
          email: email,
          name: nome,
        },
        content: [{
          type: 'text/html',
          value: htmlContent,
        }],
      }),
    });

    if (!sendgridResponse.ok) {
      const errorText = await sendgridResponse.text();
      console.error('❌ Erro SendGrid:', errorText);
      return res.status(500).json({ error: 'Falha ao enviar email', details: errorText });
    }

    console.log('✅ Email enviado com sucesso!');
    return res.json({ success: true, message: 'Email enviado com sucesso!' });

  } catch (error) {
    console.error('❌ Erro:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Servidor de Email rodando em http://localhost:' + PORT);
  console.log('📧 Endpoint: POST http://localhost:' + PORT + '/api/send-email');
  console.log('');
});

