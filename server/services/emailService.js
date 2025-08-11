const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

// Email templates
const emailTemplates = {
  welcome: {
    subject: '🌍 Welcome to GlobeTrotter - Your Journey Begins!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; overflow: hidden;">
        <div style="padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🌍 Welcome to GlobeTrotter!</h1>
          <p style="margin: 20px 0; font-size: 18px; opacity: 0.9;">Your adventure starts here, {{firstName}}!</p>
        </div>
        
        <div style="background: white; color: #333; padding: 30px;">
          <h2 style="color: #667eea; margin-top: 0;">🎉 Account Successfully Created!</h2>
          
          <p>Hi <strong>{{firstName}} {{lastName}}</strong>,</p>
          
          <p>Welcome to the GlobeTrotter family! We're thrilled to have you join our community of passionate travelers.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #667eea;">🚀 What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>✈️ Plan your first amazing trip</li>
              <li>💰 Set budgets and track expenses</li>
              <li>🌟 Discover public itineraries from other travelers</li>
              <li>📱 Access your dashboard anytime, anywhere</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              🎯 Go to Dashboard
            </a>
          </div>
          
          <p style="margin-bottom: 0;">Happy travels!</p>
          <p style="margin: 5px 0 0 0;"><strong>The GlobeTrotter Team</strong></p>
        </div>
        
        <div style="background: #667eea; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0; opacity: 0.8;">Need help? Contact us at support@globetrotter.com</p>
        </div>
      </div>
    `
  },

  login: {
    subject: '🔐 Login Alert - GlobeTrotter Account Access',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🔐 Login Detected</h1>
        </div>
        
        <div style="padding: 30px; color: #333;">
          <p>Hi <strong>{{firstName}}</strong>,</p>
          
          <p>We detected a login to your GlobeTrotter account:</p>
          
          <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>📅 Time:</strong> {{loginTime}}</p>
            <p style="margin: 5px 0 0 0;"><strong>🌐 Location:</strong> {{location}}</p>
          </div>
          
          <p>If this was you, no action is needed. If you didn't log in, please secure your account immediately.</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="{{securityUrl}}" style="background: #dc2626; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              🛡️ Secure Account
            </a>
          </div>
          
          <p style="margin-bottom: 0;">Stay safe!</p>
          <p style="margin: 5px 0 0 0;"><strong>GlobeTrotter Security Team</strong></p>
        </div>
      </div>
    `
  },

  tripCreated: {
    subject: '🎉 New Trip Created - {{tripTitle}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎉 Trip Created Successfully!</h1>
        </div>
        
        <div style="padding: 30px; color: #333;">
          <p>Hi <strong>{{firstName}}</strong>,</p>
          
          <p>Great news! Your trip "<strong>{{tripTitle}}</strong>" has been created successfully.</p>
          
          <div style="background: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #d97706;">✈️ Trip Details</h3>
            <p style="margin: 5px 0;"><strong>📍 Destinations:</strong> {{destinations}}</p>
            <p style="margin: 5px 0;"><strong>📅 Dates:</strong> {{startDate}} - {{endDate}}</p>
            <p style="margin: 5px 0;"><strong>💰 Budget:</strong> {{budget}}</p>
          </div>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="{{tripUrl}}" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              🗺️ View Trip Details
            </a>
          </div>
          
          <p>Start adding activities and make your trip unforgettable!</p>
          
          <p style="margin-bottom: 0;">Happy planning!</p>
          <p style="margin: 5px 0 0 0;"><strong>The GlobeTrotter Team</strong></p>
        </div>
      </div>
    `
  }
};

// Send email function
const sendEmail = async (to, templateName, data = {}) => {
  try {
    // Validate email configuration
    if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
      throw new Error('Email configuration missing: MAIL_USERNAME or MAIL_PASSWORD not set');
    }

    if (!process.env.MAIL_DEFAULT_SENDER) {
      throw new Error('Email configuration missing: MAIL_DEFAULT_SENDER not set');
    }

    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    // Compile template
    const compiledSubject = handlebars.compile(template.subject)(data);
    const compiledHtml = handlebars.compile(template.html)(data);

    const mailOptions = {
      from: `"GlobeTrotter" <${process.env.MAIL_DEFAULT_SENDER}>`,
      to: to,
      subject: compiledSubject,
      html: compiledHtml
    };

    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📧 Email subject: ${compiledSubject}`);
    console.log(`📧 Using SMTP: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', {
      error: error.message,
      code: error.code,
      command: error.command,
      to: to,
      templateName: templateName
    });
    throw error;
  }
};

// Specific email functions
const sendWelcomeEmail = async (user) => {
  const data = {
    firstName: user.firstName,
    lastName: user.lastName,
    dashboardUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard`
  };
  
  return await sendEmail(user.email, 'welcome', data);
};

const sendLoginAlert = async (user, loginInfo = {}) => {
  const data = {
    firstName: user.firstName,
    loginTime: new Date().toLocaleString(),
    location: loginInfo.location || 'Unknown',
    securityUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/security`
  };
  
  return await sendEmail(user.email, 'login', data);
};

const sendTripCreatedEmail = async (user, trip) => {
  const data = {
    firstName: user.firstName,
    tripTitle: trip.title,
    destinations: trip.destinations?.join(', ') || 'Not specified',
    startDate: new Date(trip.startDate).toLocaleDateString(),
    endDate: new Date(trip.endDate).toLocaleDateString(),
    budget: trip.budget ? `${trip.currency} ${trip.budget.toLocaleString()}` : 'Not set',
    tripUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/trips/${trip._id}`
  };
  
  return await sendEmail(user.email, 'tripCreated', data);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendLoginAlert,
  sendTripCreatedEmail,
  transporter
};
