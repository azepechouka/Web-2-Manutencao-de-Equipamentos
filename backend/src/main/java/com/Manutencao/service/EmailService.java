package com.Manutencao.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@localhost}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTemporaryPassword(@NonNull String to, @NonNull String nome, @NonNull String senhaPlano)
            throws MessagingException {

        String subject = "Sua senha temporária";
        String html = """
                <div style="font-family:Arial,sans-serif;max-width:520px">
                  <h2>Olá, %s!</h2>
                  <p>Seu cadastro foi realizado com sucesso.</p>
                  <p><b>Sua senha temporária:</b></p>
                  <div style="font-size:22px;padding:12px 16px;border:1px solid #ddd;border-radius:8px;display:inline-block">
                    <code>%s</code>
                  </div>
                  <p style="margin-top:16px;color:#666">
                    Por segurança, altere sua senha no primeiro acesso.
                  </p>
                </div>
                """.formatted(escape(nome), escape(senhaPlano));

        MimeMessage msg = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, "UTF-8");
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);

        mailSender.send(msg);
    }

    // evita quebrar HTML se vier caractere estranho
    private static String escape(String s) {
        return s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;");
    }
}