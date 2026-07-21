async function generateContent() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const topic = document.getElementById('topicInput').value.trim();
    const type = document.getElementById('contentType').value;
    const tone = document.getElementById('tone').value;
    const outputDiv = document.getElementById('output');
    const loader = document.getElementById('loader');

    if (!apiKey) {
        alert('Please enter your Gemini API Key first!');
        return;
    }
    if (!topic) {
        alert('Please enter a topic or video idea!');
        return;
    }

    // Show loader
    outputDiv.classList.add('hidden');
    loader.classList.remove('hidden');

    // System Prompting logic
    let prompt = "";
    if (type === 'youtube') {
        prompt = `Act as an expert YouTube Content Creator. Generate a complete kit for a video on "${topic}". 
Tone: ${tone}. 
Include:
1. Catchy Titles (3 Options)
2. Detailed Video Script (Intro, Body Points, Call to Action)
3. SEO Description
4. High-Ranking Tags (comma separated)`;
    } else if (type === 'shorts') {
        prompt = `Write a fast-paced 30-60 second Short/Reels script for topic: "${topic}". Tone: ${tone}. Include visual cues in [brackets] and spoken dialogue.`;
    } else {
        prompt = `Generate 3 detailed AI Image prompts (Midjourney/DALL-E style) to create a high-CTR YouTube thumbnail for: "${topic}".`;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            outputDiv.innerText = `Error: ${data.error.message}`;
        } else {
            const resultText = data.candidates[0].content.parts[0].text;
            outputDiv.innerText = resultText;
        }
    } catch (err) {
        outputDiv.innerText = "Failed to generate content. Please check your network connection or API Key.";
    } finally {
        loader.classList.add('hidden');
        outputDiv.classList.remove('hidden');
    }
}

function copyOutput() {
    const text = document.getElementById('output').innerText;
    if (text && text !== "Your AI-generated content will appear here...") {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    }
}
