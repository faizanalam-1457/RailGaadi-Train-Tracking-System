import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const WORKING_MODELS = [
  'meta/llama-3.2-11b-vision-instruct',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning',
  'nvidia/nemotron-3-super-120b-a12b',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages,
      model = 'meta/llama-3.2-11b-vision-instruct',
      systemInstruction = 'You are a world-class General Intelligence AI assistant powered by NVIDIA NIM technology. Deliver direct, accurate, and detailed answers.',
      temperature = 0.7,
      max_tokens = 1024,
    } = body as {
      messages: ChatMessage[];
      model?: string;
      systemInstruction?: string;
      temperature?: number;
      max_tokens?: number;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: { code: 'BAD_REQUEST', message: 'Messages array is required' },
          meta: { timestamp: new Date().toISOString(), cached: false },
        },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.NVIDIA_API_KEY ||
      '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';

    const formattedMessages: ChatMessage[] = [
      { role: 'system', content: systemInstruction },
      ...messages.filter((m) => m.role === 'user' || m.role === 'assistant'),
    ];

    // Priority model order: user chosen model -> verified working models
    const modelsToTry = Array.from(new Set([model, ...WORKING_MODELS]));

    let lastError = '';
    const startTime = Date.now();

    for (const targetModel of modelsToTry) {
      try {
        const nvidiaPayload = {
          model: targetModel,
          messages: formattedMessages,
          temperature: Math.min(Math.max(temperature, 0.1), 1.0),
          top_p: 0.95,
          max_tokens: max_tokens,
          stream: false,
        };

        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json',
          },
          body: JSON.stringify(nvidiaPayload),
        });

        const elapsedMs = Date.now() - startTime;

        if (response.ok) {
          const data = await response.json();
          const replyText =
            data.choices?.[0]?.message?.content ||
            'No response content received from NVIDIA model.';

          return NextResponse.json<
            ApiResponse<{
              reply: string;
              model: string;
              responseTimeMs: number;
              usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
            }>
          >({
            success: true,
            data: {
              reply: replyText,
              model: data.model || targetModel,
              responseTimeMs: elapsedMs,
              usage: data.usage,
            },
            meta: {
              timestamp: new Date().toISOString(),
              cached: false,
              provider: 'NVIDIA NIM Cloud API',
            },
          });
        }

        const errText = await response.text();
        console.warn(`NVIDIA model ${targetModel} returned status ${response.status}:`, errText);
        lastError = `Status ${response.status}: ${errText}`;
      } catch (err: any) {
        console.warn(`Error trying NVIDIA model ${targetModel}:`, err.message);
        lastError = err.message;
      }
    }

    // If all online NVIDIA NIM attempts failed, return error response so UI reports exact issue
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: 'NVIDIA_API_ERROR',
          message: `NVIDIA API endpoint error: ${lastError}`,
        },
        meta: { timestamp: new Date().toISOString(), cached: false },
      },
      { status: 500 }
    );
  } catch (err: any) {
    console.error('NVIDIA AI Route Exception:', err);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: err.message || 'Failed to process NVIDIA API request',
        },
        meta: { timestamp: new Date().toISOString(), cached: false },
      },
      { status: 500 }
    );
  }
}
