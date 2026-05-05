import { NextRequest, NextResponse } from 'next/server';

const NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const NIM_API_KEY = process.env.NIM_API_KEY;

if (!NIM_API_KEY) {
  console.warn('NIM_API_KEY not set. Character generation will fail.');
}

interface GenerateRequest {
  culture: string;
  role: string;
  ageRange: string;
  profession?: string;
  tone?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.culture || !body.role || !body.ageRange) {
      return NextResponse.json(
        { error: 'Missing required fields: culture, role, ageRange' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are GitCast, an African character generator for film and television studios. 
You create detailed, culturally grounded character profiles. 
Respond ONLY with valid JSON matching this exact structure:
{
  "name": "string",
  "age": number,
  "culture": "string",
  "role": "string", 
  "profession": "string",
  "backstory": "string (2-3 paragraphs)",
  "personality": ["string", "string", "string", "string"],
  "speech_patterns": "string",
  "relationships": "string",
  "dialogue_samples": ["string", "string", "string"],
  "visual_description": "string",
  "cultural_notes": "string",
  "voice_notes": "string",
  "casting_tags": ["string", "string", "string", "string"]
}`;

    const userPrompt = `Generate a character profile for a ${body.role} from the ${body.culture} ethnic group.
Age range: ${body.ageRange}.
${body.profession ? `Profession: ${body.profession}.` : ''}
${body.tone ? `Narrative tone: ${body.tone}.` : ''}

Requirements:
- Name must be authentic to the ${body.culture} naming tradition
- Backstory must reference real ${body.culture} cultural practices, geography, or historical context
- Dialogue samples should reflect code-switching between English and ${body.culture} linguistic patterns
- Visual description should be casting-director ready (specific, not generic)
- Cultural notes must cite actual traditions (festivals, masquerades, oral genres)
- Voice notes should guide an actor (pitch, tempo, distinctive features)

Generate the complete JSON profile now.`;

    const response = await fetch(`${NIM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NIM_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.3-70b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NIM API error:', errorText);
      return NextResponse.json(
        { error: 'Character generation failed. Please try again.' },
        { status: 502 }
      );
    }

    const nimData = await response.json();
    const content = nimData.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'Empty response from AI engine' },
        { status: 502 }
      );
    }

    let character;
    try {
      character = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        character = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Invalid JSON format');
      }
    }

    character.id = Math.random().toString(36).slice(2, 10);
    character.generated_at = new Date().toISOString();
    character._gitcast = {
      version: '2.0.0',
      engine: 'nvidia-nim',
      model: 'meta/llama-3.3-70b-instruct',
    };

    return NextResponse.json({ character });

  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
