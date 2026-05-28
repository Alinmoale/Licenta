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
            String diagnosis,
            String treatment,
            String recommendations
    ) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Medical Consultation Summary");

        message.setText(
                "Hello " + patientName + ",\n\n" +
                "Here is your medical consultation summary:\n\n" +

                "Diagnosis:\n" +
                diagnosis + "\n\n" +

                "Treatment:\n" +
                treatment + "\n\n" +

                "Recommendations:\n" +
                recommendations + "\n\n" +

                "Best regards,\nMedical Clinic"
        );

        mailSender.send(message);
    }
}