-- Create authority mapping table
CREATE TABLE public.issue_authority_mapping (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    issue_type TEXT NOT NULL UNIQUE,
    authority_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.issue_authority_mapping ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (needed for complaint routing)
CREATE POLICY "Anyone can view authority mappings" 
ON public.issue_authority_mapping 
FOR SELECT 
USING (true);

-- Create policies for admin-only modifications
CREATE POLICY "Only admins can modify authority mappings" 
ON public.issue_authority_mapping 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
));

-- Insert default authority mappings
INSERT INTO public.issue_authority_mapping (issue_type, authority_name) VALUES
('Electricity', 'Electricity Department'),
('Water Supply', 'Jal Board / Water Supply Department'),
('Garbage Collection', 'Nagar Nigam / Municipal Corporation'),
('Road Repair', 'Public Works Department (PWD)'),
('Street Light', 'Nagar Nigam / Municipal Corporation (Street Lighting Division)'),
('Public Transport', 'Local Transport Authority / RTO'),
('Noise Pollution', 'Pollution Control Board / Local Police Authority'),
('Others', 'General Administration');

-- Create trigger for updated_at
CREATE TRIGGER update_issue_authority_mapping_updated_at
BEFORE UPDATE ON public.issue_authority_mapping
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();