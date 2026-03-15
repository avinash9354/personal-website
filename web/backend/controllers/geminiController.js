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

    const makeRequest = async (model) => {
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
        path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      return new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
          let rawData = '';
          response.on('data', chunk => { rawData += chunk; });
          response.on('end', () => {
            try {
              if (response.statusCode === 200) {
                resolve(JSON.parse(rawData));
              } else {
                reject({ statusCode: response.statusCode, data: rawData });
              }
            } catch (e) { reject(e); }
          });
        });
        request.on('error', reject);
        request.write(payload);
        request.end();
      });
    };

    let data;
    try {
      // Primary attempt with 2.0-flash
      data = await makeRequest('gemini-2.0-flash');
    } catch (err) {
      // Fallback attempt with 1.5-flash if 429 occurred
      if (err.statusCode === 429) {
        console.warn('Gemini 2.0 Quota exceeded, falling back to 1.5...');
        try {
          data = await makeRequest('gemini-1.5-flash');
        } catch (fallbackErr) {
          throw new Error(`Gemini API ${fallbackErr.statusCode || 'Error'}: ${fallbackErr.data || fallbackErr.message}`);
        }
      } else {
        throw new Error(`Gemini API ${err.statusCode || 'Error'}: ${err.data || err.message}`);
      }
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ success: true, text });

  } catch (error) {
    console.error('Gemini proxy error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { geminiChat };
