import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { culture, role, ageRange, customization } = await req.json();
    if (!culture || !role || !ageRange) {
      return NextResponse.json({ error: 'culture, role, and ageRange are required' }, { status: 400 });
    }
    const professionNote = customization?.profession ? `Their profession/context: ${customization.profession}.` : '';
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are a master African storyteller and cultural consultant for film and television.

Generate a richly detailed, cinematically compelling ${culture} character:
- Narrative Role: ${role}
- Age Range: ${ageRange}
${professionNote}

Return ONLY valid JSON, no markdown, no explanation:

{
  "name": "An authentic ${culture} full name",
  "age": <specific number within the age range>,
  "backstory": "2-3 vivid paragraphs rooted in ${culture} life — family, community, economics, spirituality.",
  "personality": ["4-6 specific character traits"],
  "speech_patterns": "How this character talks, rhythm, code-switching, example phrases in ${culture} language if applicable.",
  "relationships": "Key relationships — family, community, rivals, mentors.",
  "dialogue_samples": ["3 distinct natural lines of dialogue that reveal character"],
  "visual_description": "Physical appearance, style, how they carry themselves tied to their background.",
  "cultural_notes": "2-3 specific ${culture} cultural elements — proverbs, traditions, taboos — that shape this character."
}`
      }]
    });
    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();
    const character = JSON.parse(cleaned);
    return NextResponse.json({ character });
  } catch (error) {
    console.error('GitCast error:', error);
    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 });
  }
}
