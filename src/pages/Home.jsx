import React from "react";
import { useState } from "react";
import "../App.css";
function HomePage() {
    const [formData, setFormData] = useState({
        companyName: "",
        applyingAsA: "Experienced",
        coverLetterTone: "Formal",
        jobDescription: "",
        currentResume: ""
    })

    const [geminiResponse, setGeminiResponse] = useState("");

    // Function to parse and display the structured response
    const parseAndDisplayResponse = (response) => {
        if (!response) return null;

        // Split the response into sections
        const sections = response.split(/(?=\d+\.\s\*\*)|(?=##\s)|(?=\*\*\d+\.)/);
        
        return (
            <div className="response-sections">
                {sections.map((section, index) => {
                    if (!section.trim()) return null;
                    
                    // Check if it's a main section (numbered)
                    const isMainSection = /^\d+\.\s\*\*/.test(section.trim()) || /^\*\*\d+\./.test(section.trim());
                    
                    if (isMainSection) {
                        // Extract title and content
                        const lines = section.trim().split('\n');
                        const titleLine = lines[0];
                        const content = lines.slice(1).join('\n').trim();
                        
                        // Extract clean title
                        const title = titleLine.replace(/^\d+\.\s\*\*/, '').replace(/\*\*$/, '').replace(/^\*\*\d+\./, '').trim();
                        
                        return (
                            <div key={index} className="response-section">
                                <h3 className="section-title">{title}</h3>
                                <div className="section-content">
                                    {formatContent(content)}
                                </div>
                            </div>
                        );
                    } else {
                        // Handle any remaining content
                        return (
                            <div key={index} className="response-section">
                                <div className="section-content">
                                    {formatContent(section.trim())}
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        );
    };

    // Function to format content within sections
    const formatContent = (content) => {
        if (!content) return null;
        
        return content.split('\n').map((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return <br key={index} />;
            
            // Handle bullet points
            if (trimmedLine.startsWith('- ')) {
                return (
                    <div key={index} className="bullet-point">
                        • {trimmedLine.substring(2)}
                    </div>
                );
            }
            
            // Handle bold text
            if (trimmedLine.includes('**')) {
                const parts = trimmedLine.split('**');
                return (
                    <p key={index}>
                        {parts.map((part, partIndex) => 
                            partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
                        )}
                    </p>
                );
            }
            
            // Handle sub-headers or emphasized lines
            if (trimmedLine.endsWith(':')) {
                return <h4 key={index} className="sub-header">{trimmedLine}</h4>;
            }
            
            // Regular paragraph
            return <p key={index}>{trimmedLine}</p>;
        });
    };

    async function handleGenerateData() {
        console.log("FormDATA: ", formData);
        setGeminiResponse('Generating response, please wait...');
        const prompt = `
        You are a professional career coach and resume optimization expert. 
Your task is to generate a personalized cover letter, improve the resume content, 
and provide an ATS (Applicant Tracking System) analysis.

Inputs:
- Company Name: ${formData.companyName}
- Experience Level: ${formData.applyingAsA}  (Fresher / Experienced)
- Job Description: ${formData.jobDescription}
- Current Resume: ${formData.currentResume} (If empty, assume no resume exists and create a draft)
- Preferred Tone: ${formData.coverLetterTone}

Output (format clearly in sections):

1. **Tailored Cover Letter**  
   - Write a professional cover letter addressed to ${formData.companyName}.  
   - Use the specified tone: ${formData.coverLetterTone}.  
   - Highlight relevant skills and experiences based on the job description.  

2. **Updated Resume Content**  
   - Suggest optimized resume summary, bullet points, and skills tailored to ${formData.jobDescription}.  
   - Ensure the content is concise, achievement-focused, and ATS-friendly.  

3. **Keyword Match Analysis**  
   - Extract the most important keywords from the job description.  
   - Check if they exist in the provided resume (if given).  
   - List missing keywords that should be added.  

4. **ATS Score Estimate (0–100)**  
   - Provide a rough ATS match score for the current resume against the job description.  
   - Explain the reasoning briefly (e.g., missing keywords, formatting issues, irrelevant content).  

Ensure the response is structured, clear, and easy to display in a React app. 
        `;  
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-goog-api-key':'AIzaSyBpHyuniXqyyJ2yfGDdMtcP1KNIFDiHk5g'
                //'X-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY
            },
            body: `{"contents":[{"parts":[{"text":"${prompt}"}]}]}`
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log('Generated Gemini Data: ', data.candidates[0].content.parts[0].text);
            setGeminiResponse(data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error(error);
        }
    }
    //[your API Key]
    return (
        <div className="container-fluid min-vh-100" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #1e3c72 1%, #2a5298 100%)' }}>
            {/* Header Section */}
            <div className="hero-section py-5 mb-4" style={{ background: 'linear-gradient(120deg, #2E3192 0%, #1BFFFF 100%)' }}>
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <h1 className="display-4 fw-bold mb-3 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>AI Resume Builder</h1>
                            <h4 className="text-white mb-3" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>By Durgaprasad Nanepalli </h4>
                            <p className="lead mb-0 text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>Create professional cover letters and optimize your resume with AI-powered insights</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Form Card */}
                        <div className="card shadow-lg border-0 mb-5" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                            <div className="card-header py-4" style={{ background: 'linear-gradient(to right, #141E30, #243B55)' }}>
                                <h3 className="card-title text-center mb-0 text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                                    <i className="bi bi-file-earmark-person me-2"></i>
                                    Resume & Cover Letter Generator
                                </h3>
                            </div>
                            <div className="card-body p-4" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                <form>
                                    <div className="row">
                                        <div className="col-md-6 mb-4">
                                            <label htmlFor="companyName" className="form-label fw-semibold">
                                                <i className="bi bi-building me-2" style={{ color: '#4776E6' }}></i>
                                                Company Name
                                            </label>
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg" 
                                                id="companyName"
                                                placeholder="Enter company name"
                                                value={formData.companyName} 
                                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            />
                                            <div className="form-text">Company you are applying to</div>
                                        </div>

                                        <div className="col-md-6 mb-4">
                                            <label htmlFor="applyingAsA" className="form-label fw-semibold">
                                                <i className="bi bi-person-badge me-2" style={{ color: '#4776E6' }}></i>
                                                Experience Level
                                            </label>
                                            <select 
                                                className="form-select form-select-lg" 
                                                id="applyingAsA"
                                                value={formData.applyingAsA} 
                                                onChange={(e) => setFormData({ ...formData, applyingAsA: e.target.value })}
                                            >
                                                <option value="Fresher">Fresher</option>
                                                <option value="Experienced">Experienced</option>
                                            </select>
                                            <div className="form-text">Are you applying as a fresher or experienced person</div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="coverLetterTone" className="form-label fw-semibold">
                                            <i className="bi bi-chat-square-text me-2" style={{ color: '#4776E6' }}></i>
                                            Cover Letter Tone
                                        </label>
                                        <select 
                                            className="form-select form-select-lg" 
                                            id="coverLetterTone"
                                            value={formData.coverLetterTone} 
                                            onChange={(e) => setFormData({ ...formData, coverLetterTone: e.target.value })}
                                        >
                                            <option value="Formal">Formal</option>
                                            <option value="Informal">Informal</option>
                                            <option value="Casual">Casual</option>
                                        </select>
                                        <div className="form-text">Select the tone of your cover letter</div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold" htmlFor="jobDescription">
                                            <i className="bi bi-file-text me-2" style={{ color: '#4776E6' }}></i>
                                            Job Description
                                        </label>
                                        <textarea 
                                            name="jobDescription" 
                                            id="jobDescription" 
                                            className="form-control" 
                                            rows="6"
                                            placeholder="Paste the job description here..."
                                            value={formData.jobDescription} 
                                            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                        ></textarea>
                                        <div className="form-text">Paste the complete job description for better matching</div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold" htmlFor="currentResume">
                                            <i className="bi bi-file-earmark-text me-2" style={{ color: '#4776E6' }}></i>
                                            Current Resume (Optional)
                                        </label>
                                        <textarea 
                                            name="currentResume" 
                                            id="currentResume" 
                                            className="form-control" 
                                            rows="8"
                                            placeholder="Paste your current resume content here (optional)..."
                                            value={formData.currentResume} 
                                            onChange={(e) => setFormData({ ...formData, currentResume: e.target.value })}
                                        ></textarea>
                                        <div className="form-text">Paste your current resume to get optimization suggestions</div>
                                    </div>

                                    <div className="d-grid">
                                        <button 
                                            type="button" 
                                            className="btn btn-lg py-3 text-white" 
                                            style={{
                                                background: 'linear-gradient(to right, #4776E6, #8E54E9)',
                                                border: 'none',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                            }}
                                            onClick={handleGenerateData}
                                        >
                                            <i className="bi bi-magic me-2"></i>
                                            Generate AI-Powered Resume & Cover Letter
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Response Section */}
                        <div className="response-container">
                            {geminiResponse && (
                                <div className="card shadow-lg border-0" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                                    <div className="card-header py-3" style={{ background: 'linear-gradient(to right, #141E30, #243B55)' }}>
                                        <h3 className="card-title mb-0 text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                                            <i className="bi bi-check-circle me-2" style={{ color: '#4776E6' }}></i>
                                            AI Generated Results
                                        </h3>
                                    </div>
                                    <div className="card-body p-4" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="gemini-response">
                                            {parseAndDisplayResponse(geminiResponse)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default HomePage;