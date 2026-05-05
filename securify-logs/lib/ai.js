const { GoogleGenAI } = require('@google/genai');

let aiClient = null;

function initAI(apiKey) {
  if (apiKey) {
    try {
      aiClient = new GoogleGenAI({ apiKey });
      console.log('[securify-logs] Gemini AI integration enabled.');
    } catch (err) {
      console.error('[securify-logs] Failed to initialize Gemini AI:', err.message);
    }
  }
}

async function analyzeLogsBatch(logs) {
  if (!aiClient) {
    return "Gemini API Key was not configured in `securify.init()`. Please provide a `geminiApiKey` to enable AI Insights.";
  }

  // Filter to logs that actually have threat flags to save tokens and focus the AI, 
  // or just include all. We'll include the last 50 threats and 50 normal requests to give context.
  const threats = logs.filter(l => l.flags && l.flags.length > 0).slice(0, 100);
  const normal = logs.filter(l => !l.flags || l.flags.length === 0).slice(0, 20);
  
  const sampleData = [...threats, ...normal].map(l => ({
    t: new Date(l.timestamp).toLocaleTimeString(),
    m: l.method,
    p: l.url,
    ip: l.ip,
    f: l.flags
  }));

  const prompt = `You are a Senior Cybersecurity Analyst reviewing firewall logs.
Analyze the following sample of recent HTTP traffic. The sample contains both normal traffic and intercepted threats.
Identify any ongoing coordinated attacks, the specific techniques being used (e.g. SQL Injection, XSS, Scanners), and provide a professional, concise executive summary.
Finally, provide 3 actionable mitigation strategies.

Return your response in cleanly formatted Markdown using headings, bullet points, and bold text. Do NOT wrap the entire response in a markdown code block, just return the raw markdown.

Logs:
${JSON.stringify(sampleData, null, 2)}
`;

  try {
    console.log('[securify-logs] Generating AI Insights...');
    const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (err) {
    console.error('[securify-logs] Gemini API Error:', err.message);
    return `**Error generating AI report:** ${err.message}`;
  }
}

module.exports = {
  initAI,
  analyzeLogsBatch
};
