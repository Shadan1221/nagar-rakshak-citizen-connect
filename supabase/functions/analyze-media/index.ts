import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { mediaUrl, issueType } = await req.json();

    if (!mediaUrl) {
      throw new Error('Media URL is required');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant analyzing civic issues from uploaded media. Based on the image/video, generate a 2-3 line description covering:
            1. Severity of the problem (High/Medium/Low)
            2. Genuineness assessment
            Keep it concise and professional for a civic complaint system.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                content: `Analyze this ${issueType || 'civic'} issue and provide a brief assessment:`
              },
              {
                type: 'image_url',
                image_url: {
                  url: mediaUrl
                }
              }
            ]
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Failed to analyze media');
    }

    const generatedDescription = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      description: generatedDescription,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-media function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});