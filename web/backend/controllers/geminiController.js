const https = require('https');

// @desc    Proxy Gemini AI chat request (keeps API key server-side)
// @route   POST /api/gemini/chat
// @access  Public
const geminiChat = async (req, res) => {
  try {
    const { contents, systemInstruction } = req.body;

    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ success: false, message: 'Invalid request body' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Gemini API key not configured' });
    }

    const payload = JSON.stringify({
      system_instruction: systemInstruction || { parts: [{ text: '' }] },
      contents,
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const data = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let rawData = '';
        response.on('data', chunk => { rawData += chunk; });
        response.on('end', () => {
          try {
            if (response.statusCode !== 200) {
              reject(new Error(`Gemini API ${response.statusCode}: ${rawData}`));
            } else {
              resolve(JSON.parse(rawData));
            }
          } catch (e) { reject(e); }
        });
      });
      request.on('error', reject);
      request.write(payload);
      request.end();
    });

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ success: true, text });

  } catch (error) {
    console.error('Gemini proxy error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { geminiChat };
