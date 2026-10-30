import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    // Iconic warm, calm, empathetic female voice: Rachel (21m00Tcm4TlvDq8ikWAM) or Sarah (EXAVITQu4vr4xnSDxMaL)
    const selectedVoice = voiceId || "21m00Tcm4TlvDq8ikWAM";

    if (apiKey && !apiKey.includes("your_elevenlabs")) {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_turbo_v2_5",
            voice_settings: {
              stability: 0.55,
              similarity_boost: 0.85,
              style: 0.2,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        return new NextResponse(audioBuffer, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=3600",
          },
        });
      } else {
        const errText = await response.text();
        console.warn("[ElevenLabs TTS Error]:", response.status, errText);
      }
    }

    return NextResponse.json(
      { error: "ElevenLabs API key missing or unavailable" },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("[TTS Route Error]:", error);
    return NextResponse.json(
      { error: error?.message || "TTS synthesis failed" },
      { status: 500 }
    );
  }
}
