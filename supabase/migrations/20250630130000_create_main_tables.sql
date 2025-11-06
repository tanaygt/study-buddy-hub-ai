-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on groups table
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Create policies for groups
CREATE POLICY "Users can view all groups" 
  ON public.groups 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create groups" 
  ON public.groups 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups" 
  ON public.groups 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Group creators can delete their groups" 
  ON public.groups 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Create group_members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Enable RLS on group_members table
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Create policies for group_members
CREATE POLICY "Users can view members of groups they belong to" 
  ON public.group_members 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.group_members gm 
      WHERE gm.group_id = group_members.group_id 
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join groups" 
  ON public.group_members 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" 
  ON public.group_members 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create group_messages table
CREATE TABLE IF NOT EXISTS public.group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on group_messages table
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for group_messages
CREATE POLICY "Users can view messages in groups they belong to" 
  ON public.group_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm 
      WHERE gm.group_id = group_messages.group_id 
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in groups they belong to" 
  ON public.group_messages 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.group_members gm 
      WHERE gm.group_id = group_messages.group_id 
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own messages" 
  ON public.group_messages 
  FOR DELETE 
  USING (auth.uid() = sender_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_group_id ON public.group_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_created_at ON public.group_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_groups_code ON public.groups(code);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (NEW.id, NULL, NULL);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

