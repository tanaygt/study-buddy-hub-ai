
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
  userId: string;
  confirmationToken: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userId, confirmationToken }: ConfirmationEmailRequest = await req.json();

    console.log("Sending confirmation email to:", email);

    // Create Supabase client for database operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store confirmation token in database
    const { error: dbError } = await supabase
      .from('email_confirmations')
      .insert({
        user_id: userId,
        email: email,
        token: confirmationToken,
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store confirmation token");
    }

    // Create confirmation URL
    const confirmationUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/confirm-email?token=${confirmationToken}`;

    const emailResponse = await resend.emails.send({
      from: "StudyBuddy AI <noreply@studybuddy.ai>",
      to: [email],
      subject: "Welcome to StudyBuddy AI – Please Confirm Your Email",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Your Email - StudyBuddy AI</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              border: 1px solid #e2e8f0;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e2e8f0;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 8px;
            }
            .tagline {
              color: #64748b;
              font-size: 16px;
              margin: 0;
            }
            .welcome-text {
              font-size: 24px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 16px;
            }
            .description {
              color: #475569;
              margin-bottom: 32px;
              font-size: 16px;
            }
            .confirmation-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              padding: 16px 32px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              text-align: center;
              margin: 20px 0;
              transition: transform 0.2s;
            }
            .confirmation-button:hover {
              transform: translateY(-1px);
            }
            .features-section {
              margin: 40px 0;
              padding: 24px;
              background: #f8fafc;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .features-title {
              font-size: 18px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 16px;
              text-align: center;
            }
            .features-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin-top: 16px;
            }
            .feature-item {
              display: flex;
              align-items: center;
              color: #475569;
              font-size: 14px;
            }
            .feature-icon {
              margin-right: 8px;
              font-size: 18px;
            }
            .security-notice {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 6px;
              padding: 16px;
              margin: 24px 0;
            }
            .security-notice-title {
              font-weight: 600;
              color: #92400e;
              margin-bottom: 8px;
            }
            .security-notice-text {
              color: #92400e;
              font-size: 14px;
              margin: 0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 24px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              color: #64748b;
              font-size: 14px;
            }
            .footer-links {
              margin-top: 16px;
            }
            .footer-links a {
              color: #667eea;
              text-decoration: none;
              margin: 0 12px;
            }
            .expiry-notice {
              background: #fee2e2;
              border: 1px solid #fca5a5;
              border-radius: 6px;
              padding: 12px;
              margin: 16px 0;
              text-align: center;
            }
            .expiry-notice-text {
              color: #dc2626;
              font-size: 14px;
              font-weight: 500;
              margin: 0;
            }
            @media (max-width: 600px) {
              body { padding: 10px; }
              .container { padding: 24px; }
              .features-grid { grid-template-columns: 1fr; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">StudyBuddy AI</div>
              <p class="tagline">Your AI-Powered Study Companion</p>
            </div>
            
            <h1 class="welcome-text">Welcome to StudyBuddy AI! 🎓</h1>
            
            <p class="description">
              Thank you for joining our intelligent learning community. To get started with AI-powered study tools, collaborative groups, and personalized learning experiences, please confirm your email address.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${confirmationUrl}" class="confirmation-button">
                Confirm Your Email Address
              </a>
            </div>
            
            <div class="expiry-notice">
              <p class="expiry-notice-text">⏱️ This confirmation link expires in 24 hours</p>
            </div>
            
            <div class="features-section">
              <h2 class="features-title">What's waiting for you:</h2>
              <div class="features-grid">
                <div class="feature-item">
                  <span class="feature-icon">🤖</span>
                  <span>AI Chat Tutor for instant help</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">👥</span>
                  <span>Study Groups with real-time chat</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🃏</span>
                  <span>Smart AI-powered flashcards</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">📈</span>
                  <span>Progress tracking & analytics</span>
                </div>
              </div>
            </div>
            
            <div class="security-notice">
              <div class="security-notice-title">🔒 Security Notice</div>
              <p class="security-notice-text">
                If you didn't create a StudyBuddy AI account, please ignore this email. Your information is secure and this link will expire automatically.
              </p>
            </div>
            
            <div class="footer">
              <p><strong>StudyBuddy AI Team</strong><br>
              Empowering students with intelligent learning tools</p>
              
              <div class="footer-links">
                <a href="#">Privacy Policy</a> | 
                <a href="#">Terms of Service</a> | 
                <a href="#">Help Center</a>
              </div>
              
              <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
                © 2025 StudyBuddy AI. Created by Tanay Shrivastava. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
