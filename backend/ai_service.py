from openai import OpenAI
from config import settings
import json
from typing import List, Dict, Any


class AIService:
    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,
            default_headers={
                "HTTP-Referer": "https://careeroai.com",
                "X-Title": "CareeroAi"
            }
        )

        self.model = "openai/gpt-3.5-turbo"

    # =====================================================
    # JOB SKILL EXTRACTION (Recruiter Side)
    # =====================================================

    def extract_job_skills(self, title: str, description: str):

        prompt = f"""
Extract required skills and location.

Job Title: {title}
Description: {description}

Return JSON:
{{"skills":["Python","SQL"], "location":"Remote"}}
"""

        try:
            res = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=300
            )

            return json.loads(res.choices[0].message.content)

        except Exception as e:
            print("extract_job_skills error:", e)
            return {"skills": [], "location": "Remote"}

    # =====================================================
    # CANDIDATE RECOMMENDER (Match jobs for candidate)
    # =====================================================

    def recommend_jobs_for_candidate(
        self,
        candidate_skills: List[str],
        jobs: List[Dict]
    ) -> List[Dict]:

        ranked = []

        for job in jobs:
            job_skills = job.get("skills", [])

            matched = set(s.lower() for s in candidate_skills) & \
                      set(s.lower() for s in job_skills)

            score = int((len(matched) / max(len(job_skills), 1)) * 100)

            ranked.append({
                **job,
                "match_percentage": score
            })

        ranked.sort(key=lambda x: x["match_percentage"], reverse=True)

        return ranked

    # =====================================================
    # RECRUITER RECOMMENDER (Match candidates for job)
    # =====================================================

    def recommend_candidates_for_job(
        self,
        job_skills: List[str],
        candidates: List[Dict]
    ) -> List[Dict]:

        ranked = []

        for candidate in candidates:
            skills = candidate.get("skills", [])

            matched = set(s.lower() for s in skills) & \
                      set(s.lower() for s in job_skills)

            score = int((len(matched) / max(len(job_skills), 1)) * 100)

            ranked.append({
                **candidate,
                "match_score": score
            })

        ranked.sort(key=lambda x: x["match_score"], reverse=True)

        return ranked
    # -------------------------------------------------
    # AI RERANK
    # -------------------------------------------------
    def rerank_candidates(
        self,
        job: Dict[str, Any],
        candidates: List[Dict[str, Any]]
    ):

        prompt = f"""
You are a senior technical recruiter.

Job Title: {job.get("title")}
Job Description: {job.get("description")}
Required Skills: {job.get("skills")}
Location: {job.get("location")}

Candidates:
{json.dumps(candidates, indent=2)}

Re-rank the BEST candidates for this job.

Return JSON:
{{"candidates": [...]}}
"""

        try:

            res = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                response_format={"type": "json_object"}
            )

            data = json.loads(res.choices[0].message.content)

            return data.get("candidates", candidates)

        except Exception as e:
            print("AI rerank error:", e)
            return candidates
    # =====================================================
    # INTERVIEW QUESTIONS - AI GENERATED
    # =====================================================

    def generate_interview_questions(self, job_title: str, job_description: str):

        prompt = f"""
Generate 5 interview questions for:

Job Title: {job_title}

Return JSON:
{{"questions":["Q1","Q2","Q3","Q4","Q5"]}}
"""

        try:
            res = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=400
            )

            data = json.loads(res.choices[0].message.content)
            return data.get("questions", [])

        except Exception as e:
            print("generate_interview_questions error:", e)

            return [
                "Explain your experience with this role.",
                "What technologies are you strongest in?",
                "Describe a challenging project.",
                "How do you debug issues?",
                "Why should we hire you?"
            ]

    # =====================================================
    # ADVANCED INTERVIEW QUESTIONS - JOB SPECIFIC
    # =====================================================

    def generate_interview_questions_advanced(
        self,
        resume: str,
        job_title: str,
        job_description: str
    ) -> List[Dict[str, Any]]:
        """Generate 10 personalized interview questions based on job and resume"""
        
        print(f"📝 Generating AI questions for: {job_title}")
        
        prompt = f"""You are an expert interview coach. Generate exactly 10 interview questions.

JOB TITLE: {job_title}

JOB DESCRIPTION:
{job_description[:800]}

CANDIDATE RESUME:
{resume[:800]}

Generate EXACTLY 10 questions:
- Questions 1-5: BEHAVIORAL (teamwork, problem-solving, leadership, adaptability, conflict resolution)
- Questions 6-10: TECHNICAL (HIGHLY SPECIFIC to the job requirements, technologies, and tools mentioned in the job description)

Make technical questions VERY SPECIFIC to the technologies mentioned. For example:
- If job mentions React: "Explain how you would optimize React component rendering using useMemo and useCallback"
- If job mentions AWS: "Describe your experience deploying scalable applications on AWS using EC2, S3, and Lambda"
- If job mentions Python: "How would you implement a REST API using FastAPI with async endpoints?"
- If job mentions Docker: "Explain your workflow for containerizing a microservices application"

Return ONLY valid JSON (no markdown, no backticks, no explanation):
{{
  "questions": [
    {{"id": 1, "question": "Tell me about a time when you faced a tight deadline. How did you manage it?", "type": "behavioral"}},
    {{"id": 2, "question": "Describe a situation where you had to resolve a conflict within your team.", "type": "behavioral"}},
    {{"id": 3, "question": "How do you approach problem-solving when facing a complex technical challenge?", "type": "behavioral"}},
    {{"id": 4, "question": "Give an example of when you demonstrated leadership in a project.", "type": "behavioral"}},
    {{"id": 5, "question": "What motivates you in your professional career?", "type": "behavioral"}},
    {{"id": 6, "question": "Explain your experience with [SPECIFIC TECHNOLOGY from job description]", "type": "technical"}},
    {{"id": 7, "question": "How would you implement [SPECIFIC FEATURE from job requirements]?", "type": "technical"}},
    {{"id": 8, "question": "Describe your debugging process when working with [TOOL/FRAMEWORK from job]", "type": "technical"}},
    {{"id": 9, "question": "What's your approach to [SPECIFIC CHALLENGE mentioned in job]?", "type": "technical"}},
    {{"id": 10, "question": "How do you ensure [QUALITY/PERFORMANCE ASPECT from job]?", "type": "technical"}}
  ]
}}
"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8,
                max_tokens=2000,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            questions = result.get("questions", [])
            
            print(f"✅ AI Generated {len(questions)} job-specific questions")
            return questions[:10]
            
        except Exception as e:
            print(f"❌ AI Question generation error: {e}")
            import traceback
            traceback.print_exc()
            
            # Enhanced fallback with job context
            return [
                {"id": 1, "question": "Tell me about yourself and your professional background.", "type": "behavioral"},
                {"id": 2, "question": "Describe a challenging situation you faced at work and how you resolved it.", "type": "behavioral"},
                {"id": 3, "question": "How do you prioritize tasks when you have multiple deadlines?", "type": "behavioral"},
                {"id": 4, "question": "Give an example of when you worked effectively as part of a team.", "type": "behavioral"},
                {"id": 5, "question": "What motivates you in your professional career?", "type": "behavioral"},
                {"id": 6, "question": f"What technical skills make you a strong candidate for {job_title}?", "type": "technical"},
                {"id": 7, "question": f"How do you stay updated with the latest technologies in your field?", "type": "technical"},
                {"id": 8, "question": "Describe your approach to solving complex technical problems.", "type": "technical"},
                {"id": 9, "question": "What is your experience with the key technologies mentioned in this job description?", "type": "technical"},
                {"id": 10, "question": "How would you contribute to our team based on your expertise?", "type": "technical"}
            ]
    # =====================================================
    # AI-POWERED INTERVIEW ANSWER SCORING WITH DETAILED FEEDBACK
    # =====================================================

    def score_interview_answer(
        self,
        question: str,
        answer: str,
        question_type: str
    ) -> Dict[str, Any]:
        """
        AI-powered scoring with comprehensive feedback
        Returns: overall score, content score, delivery score, strengths, improvements
        """
        
        print(f"\n{'='*60}")
        print(f"🎯 AI SCORING ANSWER")
        print(f"Type: {question_type}")
        print(f"Answer length: {len(answer)} characters ({len(answer.split())} words)")
        print(f"{'='*60}\n")
        
        prompt = f"""You are a senior technical interviewer and career coach evaluating a candidate's interview response.

**QUESTION:** {question}

**QUESTION TYPE:** {question_type}

**CANDIDATE'S ANSWER:**
{answer}

**YOUR TASK:**
Provide a comprehensive evaluation with specific, actionable feedback. Be encouraging but honest.

**EVALUATION CRITERIA:**

1. **CONTENT QUALITY (0-100 points):**
   - Relevance: Does the answer address the question directly?
   - Depth: Is the response detailed with specific examples?
   - Technical accuracy: Are technical details correct? (for technical questions)
   - Examples: Does the candidate provide concrete, real-world examples?
   - Completeness: Did they cover all aspects of the question?
   - Impact: Do they explain the outcomes/results of their actions?

2. **DELIVERY & COMMUNICATION (0-100 points):**
   - Structure: Is the answer well-organized? (STAR method for behavioral)
   - Clarity: Is the explanation easy to follow?
   - Professionalism: Appropriate language and tone?
   - Conciseness: Right balance of detail vs brevity?
   - Confidence: Does the answer show ownership and confidence?

**SCORING GUIDE:**
- 90-100: Exceptional answer, would strongly recommend hiring
- 80-89: Strong answer, meets expectations well
- 70-79: Good answer, some room for improvement
- 60-69: Acceptable answer, needs development
- Below 60: Weak answer, significant gaps

**FEEDBACK REQUIREMENTS:**
- Be specific with examples from their answer
- Provide 3 actionable improvement areas
- Highlight 3 specific strengths
- Content feedback should reference specific parts of their answer
- Delivery feedback should guide them on better structuring

Return ONLY valid JSON (no markdown, no backticks):
{{
  "overallScore": 85,
  "contentScore": {{
    "score": 88,
    "feedback": "Strong technical depth with specific examples from your experience with [mention specific detail from answer]. You clearly demonstrated understanding of [concept]. The explanation of [specific part] was particularly well-articulated. Consider adding more quantifiable metrics to strengthen your impact story."
  }},
  "deliveryScore": {{
    "score": 82,
    "feedback": "Your answer was well-structured and easy to follow. The progression from [point A] to [point B] made logical sense. To improve: explicitly use the STAR method (Situation-Task-Action-Result) to make your structure even clearer, especially when describing the [specific part of answer]."
  }},
  "improvementAreas": [
    "Use the STAR method more explicitly: Start with Situation, then Task, then your specific Actions, and finally the measurable Results",
    "Add specific metrics and numbers: Instead of 'improved performance', say 'reduced load time by 40% from 2s to 1.2s'",
    "Be slightly more concise: Focus on the most impactful 2-3 points rather than covering everything"
  ],
  "strengths": [
    "Provided a concrete, real-world example from your experience at [company/project mentioned]",
    "Demonstrated clear technical understanding of [specific technology/concept mentioned]",
    "Showed ownership and problem-solving ability when you [specific action mentioned]"
  ]
}}
"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4,
                max_tokens=2000,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            overall_score = result.get("overallScore", 75)
            
            print(f"✅ AI Evaluation Complete")
            print(f"📊 Overall Score: {overall_score}/100")
            print(f"   Content: {result.get('contentScore', {}).get('score', 0)}/100")
            print(f"   Delivery: {result.get('deliveryScore', {}).get('score', 0)}/100")
            print(f"{'='*60}\n")
            
            return result
            
        except Exception as e:
            print(f"❌ AI Scoring Failed: {e}")
            import traceback
            traceback.print_exc()
            
            # Intelligent fallback with basic analysis
            print("⚠️ Using fallback scoring with basic analysis\n")
            
            word_count = len(answer.split())
            sentence_count = len([s for s in answer.split('.') if s.strip()])
            
            # Basic scoring logic
            if word_count < 30:
                base_score = 50
                length_feedback = "Your answer is too brief. Aim for 100-200 words with specific examples."
            elif word_count < 80:
                base_score = 65
                length_feedback = "Good start, but add more specific details and examples."
            elif word_count < 150:
                base_score = 75
                length_feedback = "Good length with reasonable detail."
            elif word_count < 250:
                base_score = 82
                length_feedback = "Excellent detail and depth in your response."
            else:
                base_score = 78
                length_feedback = "Very detailed answer. Consider being more concise while maintaining key points."
            
            # Check for examples
            has_examples = any(keyword in answer.lower() for keyword in ['example', 'for instance', 'when i', 'at my', 'in my', 'during'])
            if has_examples:
                base_score += 5
            
            # Check for STAR method indicators
            has_star = any(keyword in answer.lower() for keyword in ['situation', 'task', 'action', 'result', 'outcome'])
            if has_star:
                base_score += 3
            
            # Check for metrics/numbers
            has_metrics = any(char.isdigit() for char in answer)
            if has_metrics:
                base_score += 2
            
            base_score = min(base_score, 85)  # Cap fallback at 85
            
            return {
                "overallScore": base_score,
                "contentScore": {
                    "score": base_score,
                    "feedback": f"{length_feedback} Your answer {'demonstrates relevant experience' if has_examples else 'would benefit from specific examples'}. {'Good use of metrics or quantifiable outcomes!' if has_metrics else 'Consider adding specific metrics or quantifiable outcomes to strengthen your points.'}"
                },
                "deliveryScore": {
                    "score": base_score,
                    "feedback": f"Your communication is {'well-structured' if sentence_count > 3 else 'clear but could use better structure'}. {'Great use of the STAR framework!' if has_star else 'Consider using the STAR method (Situation, Task, Action, Result) to structure your responses more effectively.'}"
                },
                "improvementAreas": [
                    "Use the STAR method: Situation (context), Task (challenge), Action (what you did), Result (measurable outcome)",
                    "Include specific metrics and numbers: '30% improvement' is more impactful than 'significant improvement'",
                    "Provide concrete examples from your real work experience rather than theoretical scenarios"
                ],
                "strengths": [
                    "Addressed the question directly and stayed on topic" if len(answer) > 50 else "Attempted to answer the question",
                    "Demonstrated relevant technical/professional knowledge" if word_count > 80 else "Clear and concise communication",
                    "Professional and confident communication style"
                ]
            }


    # =====================================================
    # AI INTERVIEW SCORING
    # =====================================================

#     def score_interview_answer(
#         self,
#         question: str,
#         answer: str,
#         question_type: str
#     ) -> Dict[str, Any]:
#         """Score interview answer using AI with detailed feedback"""
        
#         print(f"📊 AI Scoring {question_type} answer ({len(answer)} chars)")
        
#         prompt = f"""You are an expert interview evaluator. Score this candidate's answer comprehensively.

# Question: {question}
# Question Type: {question_type}
# Candidate's Answer: {answer}

# Evaluate the answer on these criteria:

# 1. CONTENT QUALITY (0-100):
#    - Relevance to the question asked
#    - Depth and detail of the response
#    - Use of specific examples and experiences
#    - Clarity and coherence of thought
#    - Completeness of the answer

# 2. DELIVERY (0-100):
#    - Structure and organization (bonus for STAR method)
#    - Communication clarity
#    - Professional language and tone
#    - Confidence indicators in the response
#    - Appropriate conciseness vs detail

# Provide specific, constructive, and actionable feedback.

# Return ONLY valid JSON (no markdown, no backticks):
# {{
#   "overallScore": 85,
#   "contentScore": {{
#     "score": 88,
#     "feedback": "Strong answer with specific examples. The candidate demonstrated clear understanding of the topic and provided relevant details from their experience."
#   }},
#   "deliveryScore": {{
#     "score": 82,
#     "feedback": "Well-structured response with good flow. Could improve by explicitly using the STAR method to make the structure even clearer."
#   }},
#   "improvementAreas": [
#     "Use the STAR method (Situation, Task, Action, Result) more explicitly",
#     "Include specific metrics or quantifiable outcomes where possible",
#     "Be slightly more concise while maintaining depth of detail"
#   ],
#   "strengths": [
#     "Provided specific, relevant examples from real experience",
#     "Demonstrated clear technical knowledge and problem-solving ability",
#     "Communicated thoughts clearly and professionally"
#   ]
# }}
# """

#         try:
#             response = self.client.chat.completions.create(
#                 model=self.model,
#                 messages=[{"role": "user", "content": prompt}],
#                 temperature=0.3,
#                 max_tokens=1500,
#                 response_format={"type": "json_object"}
#             )
            
#             result = json.loads(response.choices[0].message.content)
#             print(f"✅ AI Score: {result.get('overallScore', 0)}/100")
#             return result
            
#         except Exception as e:
#             print(f"❌ AI Scoring error: {e}")
#             import traceback
#             traceback.print_exc()
            
#             # Intelligent fallback scoring
#             word_count = len(answer.split())
#             base_score = min(70 + (word_count // 20), 85)
            
#             return {
#                 "overallScore": base_score,
#                 "contentScore": {
#                     "score": base_score,
#                     "feedback": "Your answer demonstrates relevant experience and addresses the question well. Consider adding more specific examples and quantifiable outcomes."
#                 },
#                 "deliveryScore": {
#                     "score": base_score,
#                     "feedback": "Clear communication. Consider structuring your response using the STAR method (Situation, Task, Action, Result) for maximum impact."
#                 },
#                 "improvementAreas": [
#                     "Use the STAR method (Situation, Task, Action, Result) to structure responses",
#                     "Include specific metrics and quantifiable outcomes from your experience",
#                     "Provide more concrete examples from your work history"
#                 ],
#                 "strengths": [
#                     "Addressed the question comprehensively",
#                     "Demonstrated relevant technical and professional experience",
#                     "Communicated clearly and professionally"
#                 ]
#             }

    # =====================================================
    # INTERVIEW EVALUATION
    # =====================================================

    def evaluate_interview(self, transcript: str, job_title: str):

        prompt = f"""
Evaluate interview transcript.

Return JSON:
{{
 "scores":{{"clarity":7,"confidence":7,"relevance":7,"communication":7}},
 "total_score":7,
 "feedback":"Short feedback",
 "red_flags":[]
}}
"""

        try:
            res = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=500
            )

            return json.loads(res.choices[0].message.content)

        except Exception as e:
            print("evaluate_interview error:", e)

            return {
                "scores": {
                    "clarity": 7,
                    "confidence": 7,
                    "relevance": 7,
                    "communication": 7
                },
                "total_score": 7,
                "feedback": "Automatic evaluation unavailable.",
                "red_flags": []
            }

    # =====================================================
    # COURSE RECOMMENDER - AI POWERED
    # =====================================================

    def recommend_courses_ai(
        self,
        missing_skills: List[str],
        job_title: str = "",
        job_description: str = ""
    ) -> List[Dict[str, Any]]:
        """AI-powered course recommendations from multiple free sources"""
        
        if not missing_skills:
            return []

        skills_text = ", ".join(missing_skills)

        prompt = f"""You are a career advisor. A candidate is applying for: {job_title}

Job Description Summary:
{job_description[:500] if job_description else "General role"}

The candidate is missing these skills: {skills_text}

For EACH missing skill, recommend 3 FREE learning resources from different platforms.

Platforms to consider:
- YouTube (specific channels/playlists)
- freeCodeCamp
- Coursera (FREE audit courses)
- edX (FREE audit)
- Khan Academy
- MIT OpenCourseWare
- Udacity (FREE courses)
- Google Skills
- Microsoft Learn
- Fast.ai
- Codecademy (FREE tier)

Return JSON ONLY (no markdown, no backticks):
{{
  "recommendations": [
    {{
      "skill": "Python",
      "courses": [
        {{
          "title": "Python for Everybody",
          "provider": "Coursera",
          "url": "https://www.coursera.org/specializations/python",
          "duration": "8 months",
          "level": "Beginner",
          "why_relevant": "Covers fundamentals needed for this role"
        }},
        {{
          "title": "Python Full Course",
          "provider": "freeCodeCamp YouTube",
          "url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
          "duration": "4.5 hours",
          "level": "Beginner",
          "why_relevant": "Quick comprehensive overview"
        }},
        {{
          "title": "Introduction to Computer Science and Programming Using Python",
          "provider": "MIT OpenCourseWare",
          "url": "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/",
          "duration": "9 weeks",
          "level": "Intermediate",
          "why_relevant": "Deep dive into Python fundamentals"
        }}
      ]
    }}
  ]
}}

Rules:
1. ALL courses must be FREE (audit option counts)
2. Include REAL, working URLs
3. Mix of quick videos and comprehensive courses
4. Prioritize resources relevant to the job description
5. Return ONLY valid JSON
"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000,
                response_format={"type": "json_object"}
            )

            result = json.loads(response.choices[0].message.content)
            return result.get("recommendations", [])

        except Exception as e:
            print(f"AI course recommendation error: {e}")
            
            # Fallback to curated courses
            return self._fallback_courses(missing_skills)

    def _fallback_courses(self, missing_skills: List[str]) -> List[Dict[str, Any]]:
        """Fallback course database when AI fails"""
        
        course_database = {
            "javascript": [
                {
                    "title": "JavaScript Full Course",
                    "provider": "freeCodeCamp",
                    "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
                    "duration": "300 hours",
                    "level": "Beginner to Advanced",
                    "why_relevant": "Complete JavaScript curriculum"
                },
                {
                    "title": "JavaScript Tutorial for Beginners",
                    "provider": "YouTube - Programming with Mosh",
                    "url": "https://www.youtube.com/watch?v=W6NZfCO5SIk",
                    "duration": "1 hour",
                    "level": "Beginner",
                    "why_relevant": "Quick start guide"
                },
                {
                    "title": "The Modern JavaScript Tutorial",
                    "provider": "javascript.info",
                    "url": "https://javascript.info/",
                    "duration": "Self-paced",
                    "level": "All levels",
                    "why_relevant": "Comprehensive free resource"
                }
            ],
            "python": [
                {
                    "title": "Python for Everybody",
                    "provider": "Coursera",
                    "url": "https://www.coursera.org/specializations/python",
                    "duration": "8 months",
                    "level": "Beginner",
                    "why_relevant": "Industry-standard beginner course"
                },
                {
                    "title": "Python Full Course",
                    "provider": "freeCodeCamp YouTube",
                    "url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
                    "duration": "4.5 hours",
                    "level": "Beginner",
                    "why_relevant": "Comprehensive video tutorial"
                },
                {
                    "title": "Introduction to Computer Science and Programming",
                    "provider": "MIT OpenCourseWare",
                    "url": "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/",
                    "duration": "9 weeks",
                    "level": "Intermediate",
                    "why_relevant": "Deep theoretical foundation"
                }
            ],
            "react": [
                {
                    "title": "React Course - Beginner's Tutorial",
                    "provider": "freeCodeCamp YouTube",
                    "url": "https://www.youtube.com/watch?v=bMknfKXIFA8",
                    "duration": "12 hours",
                    "level": "Beginner",
                    "why_relevant": "Complete React fundamentals"
                },
                {
                    "title": "Front End Development Libraries",
                    "provider": "freeCodeCamp",
                    "url": "https://www.freecodecamp.org/learn/front-end-development-libraries/",
                    "duration": "40 hours",
                    "level": "Intermediate",
                    "why_relevant": "Includes React certification"
                },
                {
                    "title": "React Official Tutorial",
                    "provider": "React.dev",
                    "url": "https://react.dev/learn",
                    "duration": "Self-paced",
                    "level": "All levels",
                    "why_relevant": "Official documentation and tutorials"
                }
            ],
            "node.js": [
                {
                    "title": "Node.js Full Course for Beginners",
                    "provider": "freeCodeCamp YouTube",
                    "url": "https://www.youtube.com/watch?v=Oe421EPjeBE",
                    "duration": "8 hours",
                    "level": "Beginner",
                    "why_relevant": "Comprehensive Node.js introduction"
                },
                {
                    "title": "Node.js Tutorial",
                    "provider": "nodejs.dev",
                    "url": "https://nodejs.dev/learn",
                    "duration": "Self-paced",
                    "level": "All levels",
                    "why_relevant": "Official Node.js learning path"
                },
                {
                    "title": "Learn Node.js",
                    "provider": "Codecademy",
                    "url": "https://www.codecademy.com/learn/learn-node-js",
                    "duration": "10 hours",
                    "level": "Intermediate",
                    "why_relevant": "Interactive learning"
                }
            ],
            "aws": [
                {
                    "title": "AWS Cloud Practitioner Essentials",
                    "provider": "AWS Training",
                    "url": "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/",
                    "duration": "6 hours",
                    "level": "Beginner",
                    "why_relevant": "Official AWS certification prep"
                },
                {
                    "title": "AWS Certified Cloud Practitioner Training",
                    "provider": "freeCodeCamp YouTube",
                    "url": "https://www.youtube.com/watch?v=SOTamWNgDKc",
                    "duration": "4 hours",
                    "level": "Beginner",
                    "why_relevant": "Free certification prep"
                },
                {
                    "title": "AWS Cloud Quest",
                    "provider": "AWS Skill Builder",
                    "url": "https://aws.amazon.com/training/digital/aws-cloud-quest/",
                    "duration": "Self-paced",
                    "level": "All levels",
                    "why_relevant": "Gamified hands-on learning"
                }
            ],
            "docker": [
                {
                    "title": "Docker Tutorial for Beginners",
                    "provider": "YouTube - TechWorld with Nana",
                    "url": "https://www.youtube.com/watch?v=3c-iBn73dDE",
                    "duration": "3 hours",
                    "level": "Beginner",
                    "why_relevant": "Clear Docker fundamentals"
                },
                {
                    "title": "Docker for Beginners",
                    "provider": "docker-curriculum.com",
                    "url": "https://docker-curriculum.com/",
                    "duration": "4 hours",
                    "level": "Beginner",
                    "why_relevant": "Hands-on Docker tutorial"
                },
                {
                    "title": "Introduction to Containers",
                    "provider": "edX - Linux Foundation",
                    "url": "https://www.edx.org/course/introduction-to-containers-kubernetes-and-red-hat",
                    "duration": "4 weeks",
                    "level": "Intermediate",
                    "why_relevant": "Professional container knowledge"
                }
            ]
        }

        recommendations = []
        for skill in missing_skills:
            skill_lower = skill.lower().strip().replace(" ", "").replace("-", "")
            
            # Find matching courses
            courses = None
            for key, value in course_database.items():
                if key in skill_lower or skill_lower in key:
                    courses = value
                    break
            
            # Generic fallback
            if not courses:
                courses = [
                    {
                        "title": f"Learn {skill}",
                        "provider": "freeCodeCamp",
                        "url": f"https://www.freecodecamp.org/news/search/?query={skill}",
                        "duration": "Self-paced",
                        "level": "All levels",
                        "why_relevant": "Search results for this skill"
                    },
                    {
                        "title": f"{skill} Tutorial",
                        "provider": "YouTube",
                        "url": f"https://www.youtube.com/results?search_query={skill}+tutorial",
                        "duration": "Varies",
                        "level": "All levels",
                        "why_relevant": "Video tutorials"
                    },
                    {
                        "title": f"{skill} on Coursera",
                        "provider": "Coursera",
                        "url": f"https://www.coursera.org/search?query={skill}",
                        "duration": "Varies",
                        "level": "All levels",
                        "why_relevant": "Professional courses"
                    }
                ]
            
            recommendations.append({
                "skill": skill,
                "courses": courses
            })
        
        return recommendations

    # =====================================================
    # SIMPLE COURSE RECOMMENDER (Backward Compatibility)
    # =====================================================
    
    def recommend_courses(self, missing_skills: List[str]):
        """Simple course recommender for backward compatibility"""
        
        results = []

        for skill in missing_skills:
            skill_clean = skill.lower()

            results.append({
                "skill": skill,
                "resources": [
                    {
                        "title": f"{skill} Full Course",
                        "platform": "YouTube",
                        "url": f"https://www.youtube.com/results?search_query={skill_clean}+tutorial"
                    },
                    {
                        "title": f"Learn {skill}",
                        "platform": "Coursera",
                        "url": f"https://www.coursera.org/search?query={skill_clean}"
                    },
                    {
                        "title": f"{skill} Course",
                        "platform": "Udemy",
                        "url": f"https://www.udemy.com/courses/search/?q={skill_clean}"
                    }
                ]
            })

        return results


# Singleton instance
ai_service = AIService()