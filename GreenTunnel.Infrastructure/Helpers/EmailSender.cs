using GreenTunnel.Core.EmailConfiguration;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;

namespace GreenTunnel.Infrastructure.Helpers;

public interface IEmailSender
{
    Task<(bool success, string errorMsg)> SendEmailAsync(MailboxAddress sender, MailboxAddress[] recipients, string subject, string body, SmtpConfig config = null, bool isHtml = true);
    Task<(bool success, string errorMsg)> SendEmailAsync(string recipientName, string recipientEmail, string subject, string body, SmtpConfig config = null, bool isHtml = true);
    Task<(bool success, string errorMsg)> SendEmailAsync(string senderName, string senderEmail, string recipientName, string recipientEmail, string subject, string body, SmtpConfig config = null, bool isHtml = true);
    Task SendEmailAsync(Message message);

}

public class EmailSender : IEmailSender
{
    private readonly SmtpConfig _config;
    private readonly ILogger _logger;

    public EmailSender(IOptions<GreenTunnel.Infrastructure.AppSettings> config, ILogger<EmailSender> logger)
    {
        _config = config.Value.SmtpConfig;
        _logger = logger;
    }

    public async Task<(bool success, string errorMsg)> SendEmailAsync(
        string recipientName,
        string recipientEmail,
        string subject,
        string body,
        SmtpConfig config = null,
        bool isHtml = true)
    {
        var from = new MailboxAddress(_config.Name, _config.EmailAddress);
        var to = new MailboxAddress(recipientName, recipientEmail);

        return await SendEmailAsync(from, new MailboxAddress[] { to }, subject, body, config, isHtml);
    }
    public async Task SendEmailAsync(Message message)
    {
        var mailMessage = CreateEmailMessage(message);

        await SendAsync(mailMessage);
    }
    private async Task<(bool success, string errorMsg)> SendAsync(MimeMessage mailMessage)
    {
        //using (var client = new SmtpClient())
        //{
        //    try
        //    {
        //        await client.ConnectAsync(_config.Host, _config.Port, true);
        //        client.AuthenticationMechanisms.Remove("XOAUTH2");
        //        await client.AuthenticateAsync(_config.Username, _config.Password);

        //        await client.SendAsync(mailMessage);
        //    }
        //    catch
        //    {
        //        //log an error message or throw an exception, or both.
        //        throw;
        //    }
        //    finally
        //    {
        //        await client.DisconnectAsync(true);
        //        client.Dispose();
        //    }
        //}
        try
        {
            // config ??= _config;

            using (var client = new SmtpClient())
            {
                if (_config.UseSSL)
                    client.ServerCertificateValidationCallback = (object sender2, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;
                await client.ConnectAsync(_config.Host, _config.Port, _config.UseSSL).ConfigureAwait(false);
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                if (!string.IsNullOrWhiteSpace(_config.Username))
                    await client.AuthenticateAsync(_config.Username, _config.Password).ConfigureAwait(false);

                await client.SendAsync(mailMessage).ConfigureAwait(false);
                await client.DisconnectAsync(true).ConfigureAwait(false);
            }

            return (true, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(LoggingEvents.SEND_EMAIL, ex, "An error occurred whilst sending email");
            return (false, ex.Message);
        }
    }

    private MimeMessage CreateEmailMessage(Message message)
    {
        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress("email", _config.Username));
        emailMessage.To.AddRange(message.To);
        emailMessage.Subject = message.Subject;

        var bodyBuilder = new BodyBuilder { HtmlBody = string.Format("<h2 style='color:red;'>{0}</h2>", message.Content) };

        if (message.Attachments != null && message.Attachments.Any())
        {
            byte[] fileBytes;
            foreach (var attachment in message.Attachments)
            {
                using (var ms = new MemoryStream())
                {
                    attachment.CopyTo(ms);
                    fileBytes = ms.ToArray();
                }

                bodyBuilder.Attachments.Add(attachment.FileName, fileBytes, ContentType.Parse(attachment.ContentType));
            }
        }

        emailMessage.Body = bodyBuilder.ToMessageBody();
        //  emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = string.Format("<h2 style='color:red;'>{0}</h2>", message.Content) };
        //emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Text) { Text = message.Content };

        return emailMessage;
    }

    public async Task<(bool success, string errorMsg)> SendEmailAsync(
        string senderName,
        string senderEmail,
        string recipientName,
        string recipientEmail,
        string subject,
        string body,
        SmtpConfig config = null,
        bool isHtml = true)
    {
        var from = new MailboxAddress(senderName, senderEmail);
        var to = new MailboxAddress(recipientName, recipientEmail);

        return await SendEmailAsync(from, new MailboxAddress[] { to }, subject, body, config, isHtml);
    }

    //For background tasks such as sending emails, its good practice to use job runners such as hangfire https://www.hangfire.io
    //or a service such as SendGrid https://sendgrid.com/
    public async Task<(bool success, string errorMsg)> SendEmailAsync(
        MailboxAddress sender,
        MailboxAddress[] recipients,
        string subject,
        string body,
        SmtpConfig config = null,
        bool isHtml = true)
    {
        var message = new MimeMessage();

        message.From.Add(sender);
        message.To.AddRange(recipients);
        message.Subject = subject;
        message.Body = isHtml ? new BodyBuilder { HtmlBody = body }.ToMessageBody() : new TextPart("plain") { Text = body };

        try
        {
            config ??= _config;

            using (var client = new SmtpClient())
            {
                if (!config.UseSSL)
                    client.ServerCertificateValidationCallback = (object sender2, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;

                await client.ConnectAsync(config.Host, config.Port, config.UseSSL).ConfigureAwait(false);
                client.AuthenticationMechanisms.Remove("XOAUTH2");

                if (!string.IsNullOrWhiteSpace(config.Username))
                    await client.AuthenticateAsync(config.Username, config.Password).ConfigureAwait(false);

                await client.SendAsync(message).ConfigureAwait(false);
                await client.DisconnectAsync(true).ConfigureAwait(false);
            }

            return (true, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(LoggingEvents.SEND_EMAIL, ex, "An error occurred whilst sending email");
            return (false, ex.Message);
        }
    }
}