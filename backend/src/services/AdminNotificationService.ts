import nodemailer from 'nodemailer';
import axios from 'axios';
import moment from 'moment';

interface NotificationData {
  type: 'registration' | 'login' | 'activity' | 'activity_completed' | 'error';
  user?: {
    id: string;
    name: string;
    email: string;
  };
  activity?: {
    id: string;
    title: string;
    duration: number;
  };
  error?: {
    message: string;
    stack?: string;
  };
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  details?: any;
}

class AdminNotificationService {
  private emailTransporter: nodemailer.Transporter | null = null;
  private adminEmail: string;
  private discordWebhookUrl?: string;
  private telegramBotToken?: string;
  private telegramChatId?: string;

  constructor() {
    this.adminEmail = process.env.ADMIN_EMAIL || '';
    this.discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    this.telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    this.telegramChatId = process.env.TELEGRAM_CHAT_ID;
    
    this.setupEmailTransporter();
  }

  private setupEmailTransporter() {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    
    if (smtpUser && smtpPass) {
      this.emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
    }
  }

  async sendNotification(data: NotificationData) {
    const message = this.formatMessage(data);
    
    try {
      // Send email notification
      if (this.emailTransporter && this.adminEmail) {
        await this.sendEmailNotification(message, data);
      }

      // Send Discord notification
      if (this.discordWebhookUrl) {
        await this.sendDiscordNotification(message, data);
      }

      // Send Telegram notification
      if (this.telegramBotToken && this.telegramChatId) {
        await this.sendTelegramNotification(message, data);
      }

      // Log to console and file
      this.logNotification(data);

    } catch (error) {
      console.error('❌ Failed to send admin notification:', error);
    }
  }

  private formatMessage(data: NotificationData): string {
    const timestamp = moment(data.timestamp).format('YYYY-MM-DD HH:mm:ss');
    
    switch (data.type) {
      case 'registration':
        return `🎉 NEW USER REGISTERED
        
👤 User: ${data.user?.name} (${data.user?.email})
📧 Email: ${data.user?.email}
🕒 Time: ${timestamp}
🌐 IP: ${data.ip || 'Unknown'}
📱 Device: ${data.userAgent || 'Unknown'}`;

      case 'login':
        return `🔐 USER LOGIN
        
👤 User: ${data.user?.name} (${data.user?.email})
🕒 Time: ${timestamp}
🌐 IP: ${data.ip || 'Unknown'}
📱 Device: ${data.userAgent || 'Unknown'}`;

      case 'activity':
        return `🎯 ACTIVITY COMPLETED
        
👤 User: ${data.user?.name}
🎯 Activity: ${data.activity?.title}
⏱️ Duration: ${data.activity?.duration} minutes
🕒 Time: ${timestamp}`;

      case 'error':
        return `❌ APPLICATION ERROR
        
🚨 Error: ${data.error?.message}
🕒 Time: ${timestamp}
👤 User: ${data.user?.email || 'Unknown'}
📝 Stack: ${data.error?.stack?.substring(0, 500) || 'No stack trace'}`;

      default:
        return `📊 FOCUSFLOW NOTIFICATION
        
Type: ${data.type}
Time: ${timestamp}`;
    }
  }

  private async sendEmailNotification(message: string, data: NotificationData) {
    if (!this.emailTransporter) return;

    const subject = this.getEmailSubject(data.type);
    
    await this.emailTransporter.sendMail({
      from: process.env.SMTP_USER,
      to: this.adminEmail,
      subject: subject,
      text: message,
      html: this.formatHTMLMessage(message, data)
    });

    console.log('📧 Email notification sent to admin');
  }

  private async sendDiscordNotification(message: string, data: NotificationData) {
    if (!this.discordWebhookUrl) return;

    const color = this.getDiscordColor(data.type);
    
    await axios.post(this.discordWebhookUrl, {
      embeds: [{
        title: `FocusFlow - ${data.type.toUpperCase()}`,
        description: message,
        color: color,
        timestamp: data.timestamp.toISOString(),
        footer: {
          text: 'FocusFlow Admin Monitoring'
        }
      }]
    });

    console.log('📱 Discord notification sent');
  }

  private async sendTelegramNotification(message: string, data: NotificationData) {
    if (!this.telegramBotToken || !this.telegramChatId) return;

    const telegramMessage = `🎯 *FocusFlow Alert*\n\n${message}`;
    
    await axios.post(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
      chat_id: this.telegramChatId,
      text: telegramMessage,
      parse_mode: 'Markdown'
    });

    console.log('📱 Telegram notification sent');
  }

  private logNotification(data: NotificationData) {
    const logMessage = {
      timestamp: data.timestamp,
      type: data.type,
      user: data.user,
      activity: data.activity,
      error: data.error,
      ip: data.ip,
      userAgent: data.userAgent
    };

    // Store in global array for admin dashboard
    if (!global.adminLogs) {
      global.adminLogs = [];
    }
    
    global.adminLogs.unshift(logMessage);
    
    // Keep only last 1000 logs
    if (global.adminLogs.length > 1000) {
      global.adminLogs = global.adminLogs.slice(0, 1000);
    }

    console.log('📊 Admin log recorded:', data.type, data.user?.email || 'system');
  }

  private getEmailSubject(type: string): string {
    switch (type) {
      case 'registration': return '🎉 FocusFlow - New User Registration';
      case 'login': return '🔐 FocusFlow - User Login';
      case 'activity': return '🎯 FocusFlow - Activity Completed';
      case 'error': return '❌ FocusFlow - Application Error';
      default: return '📊 FocusFlow - Notification';
    }
  }

  private getDiscordColor(type: string): number {
    switch (type) {
      case 'registration': return 0x00ff00; // Green
      case 'login': return 0x0099ff; // Blue
      case 'activity': return 0xff9900; // Orange
      case 'error': return 0xff0000; // Red
      default: return 0x888888; // Gray
    }
  }

  private formatHTMLMessage(message: string, data: NotificationData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h2>🎯 FocusFlow Admin Alert</h2>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <pre style="background: white; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</pre>
        </div>
        <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
          FocusFlow Admin Monitoring System
        </div>
      </div>
    `;
  }
}

// Global instance
export const adminNotifier = new AdminNotificationService();

// Types for global admin logs
declare global {
  var adminLogs: any[];
}

export default AdminNotificationService;