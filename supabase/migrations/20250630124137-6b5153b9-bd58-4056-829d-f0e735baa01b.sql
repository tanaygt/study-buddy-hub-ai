
-- Create a table to track email confirmations
CREATE TABLE public.email_confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on email_confirmations table
ALTER TABLE public.email_confirmations ENABLE ROW LEVEL SECURITY;

-- Create policies for email_confirmations
CREATE POLICY "Users can view their own confirmations" 
  ON public.email_confirmations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert confirmations" 
  ON public.email_confirmations 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update confirmations" 
  ON public.email_confirmations 
  FOR UPDATE 
  USING (true);

-- Create index for faster token lookups
CREATE INDEX idx_email_confirmations_token ON public.email_confirmations(token);
CREATE INDEX idx_email_confirmations_expires ON public.email_confirmations(expires_at);
