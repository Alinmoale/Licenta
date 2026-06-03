package com.licenta.clinic.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendConsultationEmail(
            String to,
            String patientName,
            String doctorName,
            String consultationDate,
            String diagnosis,
            String treatment,
            String recommendations
    ) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Medical Consultation Summary");

        message.setText(
                "Hello " + patientName + ",\n\n" +

                "Following your recent consultation, please find below the summary provided by your doctor.\n\n" +

                "Patient: " + patientName + "\n" +
                "Doctor: " + doctorName + "\n" +
                "Date: " + consultationDate + "\n\n" +

                "━━━━━━━━━━━━━━━━━━\n" +
                "DIAGNOSIS\n" +
                "━━━━━━━━━━━━━━━━━━\n\n" +
                diagnosis + "\n\n" +

                "━━━━━━━━━━━━━━━━━━\n" +
                "TREATMENT PLAN\n" +
                "━━━━━━━━━━━━━━━━━━\n\n" +
                treatment + "\n\n" +

                "━━━━━━━━━━━━━━━━━━\n" +
                "RECOMMENDATIONS\n" +
                "━━━━━━━━━━━━━━━━━━\n\n" +
                recommendations + "\n\n" +

                "If your symptoms worsen or you have any concerns, please contact your doctor or schedule a follow-up consultation.\n\n" +

                "Best regards,\n" +
                "Medical Clinic"
        );

        mailSender.send(message);
    }
}