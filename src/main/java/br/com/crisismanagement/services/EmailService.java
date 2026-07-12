package br.com.crisismanagement.services;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * Envio de e-mails transacionais do sistema. Em ambiente sem SMTP configurado,
 * {@code quarkus.mailer.mock=true} faz o conteúdo ser apenas logado no console.
 */
@ApplicationScoped
public class EmailService {

    private static final Logger LOG = Logger.getLogger(EmailService.class);

    @Inject
    Mailer mailer;

    @ConfigProperty(name = "app.frontend.url")
    String frontendUrl;

    /**
     * Envia a senha temporária a um usuário recém-criado. A senha deverá ser
     * trocada no primeiro login.
     */
    public void enviarSenhaTemporaria(String nome, String email, String senhaTemporaria) {
        String assunto = "SGCI - Acesso criado: sua senha temporária";
        String corpo = """
                Olá, %s!

                Uma conta foi criada para você no SGCI (Sistema de Gestão de Crises).

                Acesse: %s
                E-mail (login): %s
                Senha temporária: %s

                Por segurança, você deverá definir uma nova senha no primeiro acesso.

                Se você não esperava este e-mail, ignore-o.
                """.formatted(nome, frontendUrl, email, senhaTemporaria);

        try {
            mailer.send(Mail.withText(email, assunto, corpo));
            LOG.infof("E-mail de senha temporária enviado para %s", email);
        } catch (RuntimeException e) {
            LOG.errorf(e, "Falha ao enviar e-mail de senha temporária para %s", email);
            throw e;
        }
    }

    /**
     * Envia o link de recuperação de senha. O token viaja apenas na URL; o
     * backend guarda somente o hash. O link expira em poucos minutos.
     */
    public void enviarLinkRecuperacao(String nome, String email, String token, long minutosValidade) {
        String link = "%s/redefinir-senha?token=%s".formatted(frontendUrl, token);
        String assunto = "SGCI - Recuperação de senha";
        String corpo = """
                Olá, %s!

                Recebemos uma solicitação para redefinir a senha da sua conta no SGCI.

                Para criar uma nova senha, acesse o link abaixo (válido por %d minutos):
                %s

                Se você não solicitou a redefinição, ignore este e-mail — sua senha
                permanecerá inalterada.
                """.formatted(nome, minutosValidade, link);

        try {
            mailer.send(Mail.withText(email, assunto, corpo));
            LOG.infof("E-mail de recuperação de senha enviado para %s", email);
        } catch (RuntimeException e) {
            LOG.errorf(e, "Falha ao enviar e-mail de recuperação de senha para %s", email);
            throw e;
        }
    }
}
