import OpenAI from "openai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return Response.json({ error: "Audio file is required" }, { status: 400 });
    }

    const openai = new OpenAI();
    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audio,
    });

    return Response.json({ text: transcription.text });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Transcription failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
