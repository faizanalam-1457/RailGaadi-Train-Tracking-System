import { NextRequest, NextResponse } from 'next/server';
import { TRAINS_DB, TrainEntry } from '@/lib/trains-db';
import { ApiResponse } from '@/types/api';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, trainContext } = body as {
      messages: ChatMessage[];
      trainContext?: {
        number?: string;
        name?: string;
        status?: string;
        delayMinutes?: number;
        currentStation?: string;
        nextStation?: string;
        speedKmh?: number;
      };
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

    const lastUserMsg = messages[messages.length - 1]?.content || '';
    const q = lastUserMsg.toLowerCase().trim();

    // ─── 1. Extract Train Numbers (4 or 5 digits) ───
    const trainNumMatch = q.match(/\b\d{4,5}\b/)?.[0];
    
    // ─── 2. Search TRAINS_DB ───
    let matchedTrain: TrainEntry | undefined;
    if (trainNumMatch) {
      matchedTrain = TRAINS_DB.find((t) => t.number === trainNumMatch);
    }
    
    if (!matchedTrain) {
      // Fuzzy search by train name or station code in query
      matchedTrain = TRAINS_DB.find((t) => {
        const nameLower = t.name.toLowerCase();
        return (
          nameLower.includes(q) ||
          q.includes(nameLower) ||
          (q.includes(t.from.toLowerCase()) && q.includes(t.to.toLowerCase()))
        );
      });
    }

    if (!matchedTrain && trainContext?.number) {
      matchedTrain = TRAINS_DB.find((t) => t.number === trainContext.number);
    }

    let reply = '';

    // ─── 3. Intent Resolution & Markdown Output ───
    if (matchedTrain) {
      const isContextTrain = trainContext && trainContext.number === matchedTrain.number;
      const delayMinutes = isContextTrain ? (trainContext.delayMinutes || 0) : 4;
      const delayStatus = delayMinutes > 0 ? `Running ${delayMinutes} mins behind schedule` : 'Running strictly On-Time (100% Punctual)';

      reply = `🚆 **Train Telemetry: #${matchedTrain.number} — ${matchedTrain.name}**\n\n` +
        `- **Route Corridor**: ${matchedTrain.from} (${matchedTrain.fromCode}) ➔ ${matchedTrain.to} (${matchedTrain.toCode})\n` +
        `- **Live Status**: ${delayStatus}\n` +
        `- **Cruising Speed**: ~110 - 130 km/h (Electrified High-Speed Corridor)\n` +
        `- **Operational Days**: Daily Service (Mon, Tue, Wed, Thu, Fri, Sat, Sun)\n` +
        `- **Pantry Service**: Pantry Car Available & IRCTC E-Catering Enabled\n` +
        (isContextTrain ? `- **Current Telemetry**: At ${trainContext.currentStation || 'En Route'} → Next Halt: ${trainContext.nextStation || 'Upcoming Junction'}\n` : '') +
        `\n👉 Click **[Track #${matchedTrain.number} Live Status](/train/${matchedTrain.number})** for live map vector tracking, elevation profile, and platform signals!`;

    } else if (q.includes('vande bharat') || q.includes('vande') || q.includes('t18') || q.includes('22436') || q.includes('20901')) {
      reply = `⚡ **Vande Bharat Express (Train 18) Intelligence:**\n\nIndia's premier semi-high-speed train running at 160 km/h with Executive Chair Car, panoramic windows, KAVACH anti-collision, and complimentary catering.\n\n- **22436**: [Varanasi Vande Bharat Express](/train/22436) (New Delhi ➔ Varanasi)\n- **20901**: [Mumbai Solapur Vande Bharat](/train/20901) (Mumbai CSMT ➔ Solapur)\n- **20903**: [Chennai Vande Bharat](/train/20903) (Chennai Central ➔ Coimbatore)\n- **22221**: [Mumbai Shirdi Vande Bharat](/train/22221) (Mumbai CSMT ➔ Sainagar Shirdi)\n\n👉 Track **[Varanasi Vande Bharat #22436 Live](/train/22436)** now!`;

    } else if (q.includes('rajdhani')) {
      reply = `👑 **Rajdhani Express Superfast Fleet:**\n\nHigh-priority air-conditioned express trains connecting state capitals with New Delhi with top signal preference.\n\n- **12951 / 12952**: [Mumbai Tejas Rajdhani](/train/12951) (Mumbai Central ➔ New Delhi)\n- **12301 / 12302**: [Howrah Rajdhani](/train/12301) (Howrah ➔ New Delhi)\n- **12309**: [Patna Rajdhani](/train/12309) (Patna Junction ➔ New Delhi)\n- **12433**: [Chennai Rajdhani](/train/12433) (Hazrat Nizamuddin ➔ Chennai Central)\n\n👉 Track **[Mumbai Rajdhani #12951 Live](/train/12951)**!`;

    } else if (q.includes('shatabdi')) {
      reply = `🚅 **Shatabdi Express Superfast Network:**\n\nFast day-time intercity trains offering AC Chair Car (CC) and Executive Class (EC) travel with meals included.\n\n- **12001**: [Bhopal Shatabdi](/train/12001) (New Delhi ➔ Rani Kamlapati / Bhopal)\n- **12003**: [Lucknow Swarna Shatabdi](/train/12003) (New Delhi ➔ Lucknow)\n- **12007**: [Mysuru Shatabdi](/train/12007) (Chennai Central ➔ Mysuru)\n- **12009**: [Mumbai Shatabdi](/train/12009) (Mumbai Central ➔ Ahmedabad)\n\n👉 Click on any train number above to launch real-time radar!`;

    } else if (q.includes('delhi to mumbai') || q.includes('mumbai to delhi')) {
      reply = `🚄 **Delhi ↔ Mumbai Rail Corridor Highlights:**\n\nThe 1,384 km Golden Quadrilateral corridor connects Mumbai Central (MMCT) and New Delhi (NDLS):\n\n- **12951 / 12952**: [Mumbai Tejas Rajdhani Express](/train/12951) (~15.5 hrs)\n- **12953 / 12954**: [August Kranti Rajdhani Express](/train/12953) (~16.8 hrs)\n- **12903 / 12904**: [Golden Temple Mail](/train/12903)\n\n👉 Click **[Track Mumbai Rajdhani #12951 Live](/train/12951)** to trace this route!`;

    } else if (q.includes('food') || q.includes('pantry') || q.includes('meal') || q.includes('eat') || q.includes('biryani') || q.includes('catering') || q.includes('menu')) {
      reply = `🍱 **IRCTC E-Catering & Pantry Food Guide:**\n\n- **Pantry Onboard**: Rajdhani, Shatabdi, Duronto & Vande Bharat include fresh breakfast, lunch, high tea, and dinner.\n- **Top Junction Specialty Delicacies**:\n  - **Surat (ST)**: Fresh Surat Khaman & Locho\n  - **Kota Junction (KOTA)**: Rajasthani Dal Baati & Samosas\n  - **Kanpur Central (CNB)**: Kulhad Masala Chai & Samosas\n  - **Varanasi (BSB)**: Banarasi Rabri & Malaiyo\n\n👉 Order or simulate meal delivery at your berth on our **[/pantry](/pantry)** page!`;

    } else if (q.includes('pnr') || q.includes('ticket') || q.includes('seat') || q.includes('berth') || q.includes('coach')) {
      reply = `🎫 **PNR Status & Seat Matrix Intelligence:**\n\nYou can inspect PNR status, coach layout, and seat location (Lower/Middle/Upper/Side Upper):\n\n- **Sample PNRs**: Try searching \`432-1098765\` (Mumbai Rajdhani) or \`224-3654321\` (Varanasi Vande Bharat).\n- **Coach Classes**: 1A (First AC), 2A (2-Tier AC), 3A (3-Tier AC), CC (AC Chair Car), EC (Executive Class).\n\n👉 Check seat layout on any train detail page under the **Coach & Seats** tab!`;

    } else if (q.includes('station') || q.includes('junction') || q.includes('platform') || q.includes('ndls') || q.includes('mmct') || q.includes('hwh') || q.includes('mas')) {
      reply = `🚉 **Major Railway Junction Intelligence:**\n\nExplore live mechanical arrival/departure boards and platform numbers:\n\n- **New Delhi (NDLS)**: 16 Platforms • Executive Lounge • IRCTC Food Plaza\n- **Mumbai Central (MMCT)**: 9 Platforms • Urban Pod Hotel • Tejas Lounge\n- **Howrah Junction (HWH)**: 23 Platforms • India's Largest Railway Complex\n- **Chennai Central (MAS)**: 12 Platforms • South Indian Filter Coffee Hubs\n\n👉 Browse all hubs on our **[/stations](/stations)** directory!`;

    } else if (q.includes('weather') || q.includes('rain') || q.includes('fog') || q.includes('ghats') || q.includes('western ghats')) {
      reply = `🌦️ **Route Weather & Western Ghats Terrain:**\n\n- **Western Ghats (Sahyadri Range)**: Mist and rain caution around tunnels & viaduct bridges near Khandala / Lonavala ghats. Speeds throttled to 60 km/h for safety.\n- **Northern Gangetic Plains**: Fog advisories active during winter months with KAVACH automatic train protection engaged.\n\n👉 View weather alerts & elevation curves under the **Weather** tab on any train page!`;

    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste') || q.includes('help')) {
      reply = `👋 **Namaste! I am your RailGaadi AI Assistant.**\n\nI can answer questions on Indian Railways live telemetry, schedules, delays, food delivery, and station facilities.\n\n**Try asking me**:\n- *"Is train 12951 running on time?"*\n- *"What is the route of Vande Bharat 22436?"*\n- *"Show food options at Surat station"*\n- *"Which train goes from Delhi to Mumbai?"*\n\nHow may I assist your travel today?`;

    } else {
      reply = `🚆 **RailGaadi AI Assistant:**\n\nI am ready to help you track trains, verify delays, browse station platforms, and check pantry menus.\n\n- Search for popular train numbers like **[12951](/train/12951)** (Mumbai Rajdhani), **[22436](/train/22436)** (Vande Bharat Express), **[12301](/train/12301)** (Howrah Rajdhani), or **[12621](/train/12621)** (Tamil Nadu Express).\n- Or switch to our **[/live-radar](/live-radar)** for interactive national vector map tracking!`;
    }

    return NextResponse.json<ApiResponse<{ reply: string }>>({
      success: true,
      data: { reply },
      meta: { timestamp: new Date().toISOString(), cached: false, provider: 'RailGaadi AI Core' },
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: 'AI_CHAT_FAILED', message: err.message || 'Chatbot query failed' },
        meta: { timestamp: new Date().toISOString(), cached: false },
      },
      { status: 500 }
    );
  }
}

