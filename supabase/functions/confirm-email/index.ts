
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response("Missing confirmation token", { status: 400 });
    }

    console.log("Processing email confirmation for token:", token);

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find the confirmation record
    const { data: confirmation, error: findError } = await supabase
      .from('email_confirmations')
      .select('*')
      .eq('token', token)
      .single();

    if (findError || !confirmation) {
      console.error("Token not found:", findError);
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Link - StudyBuddy AI</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8fafc; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .error { color: #dc2626; font-size: 24px; margin-bottom: 20px; }
            .btn { display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error">❌ Invalid or Expired Link</div>
            <p>This confirmation link is invalid or has expired. Please request a new confirmation email.</p>
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('//', '//').split('/')[2] || 'localhost:5173'}" class="btn">Return to StudyBuddy AI</a>
          </div>
        </body>
        </html>
      `, {
        status: 400,
        headers: { "Content-Type": "text/html", ...corsHeaders }
      });
    }

    // Check if already confirmed
    if (confirmation.confirmed_at) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Email Already Confirmed - StudyBuddy AI</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8fafc; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .success { color: #059669; font-size: 24px; margin-bottom: 20px; }
            .btn { display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✅ Email Already Confirmed</div>
            <p>Your email has already been confirmed. You can now access all StudyBuddy AI features!</p>
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('//', '//').split('/')[2] || 'localhost:5173'}" class="btn">Continue to StudyBuddy AI</a>
          </div>
        </body>
        </html>
      `, {
        status: 200,
        headers: { "Content-Type": "text/html", ...corsHeaders }
      });
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(confirmation.expires_at);
    if (now > expiresAt) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Expired - StudyBuddy AI</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8fafc; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .warning { color: #d97706; font-size: 24px; margin-bottom: 20px; }
            .btn { display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="warning">⏰ Link Expired</div>
            <p>This confirmation link has expired (valid for 24 hours). Please request a new confirmation email.</p>
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('//', '//').split('/')[2] || 'localhost:5173'}" class="btn">Return to StudyBuddy AI</a>
          </div>
        </body>
        </html>
      `, {
        status: 400,
        headers: { "Content-Type": "text/html", ...corsHeaders }
      });
    }

    // Mark as confirmed
    const { error: updateError } = await supabase
      .from('email_confirmations')
      .update({
        confirmed_at: new Date().toISOString(),
        attempts: (confirmation.attempts || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('token', token);

    if (updateError) {
      console.error("Error updating confirmation:", updateError);
      throw new Error("Failed to confirm email");
    }

    console.log("Email confirmed successfully for user:", confirmation.user_id);

    // Return success page that redirects to main site
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Confirmed - StudyBuddy AI</title>
        <meta http-equiv="refresh" content="3;url=${Deno.env.get('SUPABASE_URL')?.replace('//', '//').split('/')[2] || 'localhost:5173'}">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
          }
          .container { 
            max-width: 500px; 
            background: white; 
            color: #333;
            padding: 50px; 
            border-radius: 16px; 
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          }
          .success { 
            color: #059669; 
            font-size: 48px; 
            margin-bottom: 20px; 
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #64748b;
          }
          .redirect-notice {
            font-size: 14px;
            color: #94a3b8;
            margin-top: 20px;
          }
          .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 10px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">🎉</div>
          <div class="title">Email Confirmed Successfully!</div>
          <p class="message">
            Welcome to StudyBuddy AI! Your email has been verified and your account is now fully activated. 
            You can now access all features including AI tutoring, study groups, smart flashcards, and progress tracking.
          </p>
          <div class="redirect-notice">
            Redirecting you to StudyBuddy AI in 3 seconds... <span class="loading"></span>
          </div>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: { "Content-Type": "text/html", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("Error in confirm-email function:", error);
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error - StudyBuddy AI</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8fafc; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .error { color: #dc2626; font-size: 24px; margin-bottom: 20px; }
          .btn { display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error">❌ Confirmation Error</div>
          <p>There was an error confirming your email. Please try again or contact support.</p>
          <a href="${Deno.env.get('SUPABASE_URL')?.replace('//', '//').split('/')[2] || 'localhost:5173'}" class="btn">Return to StudyBuddy AI</a>
        </div>
      </body>
      </html>
    `, {
      status: 500,
      headers: { "Content-Type": "text/html", ...corsHeaders }
    });
  }
};

serve(handler);
