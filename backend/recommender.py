from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import fuzz
from typing import List, Dict, Any, Tuple


class Recommender:
    def __init__(self):
        self.location_aliases = {
            "sf": "san francisco",
            "nyc": "new york",
            "la": "los angeles",
            "dc": "washington",
            "bangalore": "bengaluru",
            "blr": "bengaluru",
            "hyd": "hyderabad",
            "mumbai": "mumbai",
            "delhi": "new delhi",
            "chennai": "chennai",
            "pune": "pune"
        }

    # -------------------------
    # Location helpers
    # -------------------------

    def normalize_city(self, location: str) -> str:
        if not location:
            return ""
        loc = location.lower().strip()

        for alias, full in self.location_aliases.items():
            if alias in loc:
                return full

        if "," in loc:
            return loc.split(",")[0].strip()

        return loc

    def locations_match(self, loc1: str, loc2: str, threshold: int = 80) -> bool:
        if not loc1 or not loc2:
            return False

        n1 = self.normalize_city(loc1)
        n2 = self.normalize_city(loc2)

        if "remote" in n1 or "remote" in n2:
            return True

        return fuzz.ratio(n1, n2) >= threshold

    # -------------------------
    # Skill Matching
    # -------------------------

    def calculate_skill_match(
        self,
        candidate_skills: List[str],
        job_skills: List[str]
    ) -> Tuple[float, List[str], List[str]]:

        if not candidate_skills or not job_skills:
            return 0.0, [], job_skills

        cand = [s.lower().strip() for s in candidate_skills]
        job = [s.lower().strip() for s in job_skills]

        matched = list(set(cand) & set(job))
        missing = [s for s in job if s not in cand]

        try:
            vectorizer = TfidfVectorizer()
            matrix = vectorizer.fit_transform([
                " ".join(cand),
                " ".join(job)
            ])
            similarity = cosine_similarity(matrix[0:1], matrix[1:2])[0][0]
        except:
            similarity = len(matched) / len(job)

        exact_ratio = len(matched) / len(job)
        final_score = (0.7 * exact_ratio) + (0.3 * similarity)

        return final_score, matched, missing

    # -------------------------
    # Full Score
    # -------------------------

    def calculate_score(self, candidate: Dict, job: Dict) -> Dict[str, Any]:

        skill_score, matched, missing = self.calculate_skill_match(
            candidate.get("skills", []),
            job.get("skills", [])
        )

        candidate_exp = candidate.get(
            "relevant_experience",
            candidate.get("total_experience", 0)
        )

        exp_score = 1.0 if candidate_exp >= 1 else 0.5

        location_bonus = 0.1 if self.locations_match(
            candidate.get("current_location", ""),
            job.get("location", "")
        ) else 0.0

        final = (skill_score * 0.7) + (exp_score * 0.2) + location_bonus
        final = min(final, 1.0)

        return {
            "match_score": round(final * 100, 2),
            "matched_skills": matched,
            "missing_skills": missing
        }

    # -------------------------
    # JOB RECOMMENDATIONS (FIXED)
    # -------------------------

    def recommend_jobs_for_candidate(
        self,
        candidate_resume: Dict,
        jobs: List[Dict]
    ) -> List[Dict]:

        recommendations = []

        for job in jobs:
            score = self.calculate_score(candidate_resume, job)

            if score["match_score"] < 20:
                continue

            recommendations.append({
                "job_id": job["id"],
                "title": job["title"],
                "company": job.get("company"),
                "location": job.get("location"),
                "job_type": job.get("job_type"),
                "description": job.get("description"),
                "skills": job.get("skills", []),
                "experience": job.get("experience"),
                "salary": job.get("salary"),
                "match_score": score["match_score"],
                "matched_skills": score["matched_skills"],
                "missing_skills": score["missing_skills"]
            })

        recommendations.sort(
            key=lambda x: x["match_score"],
            reverse=True
        )

        return recommendations

    # -------------------------
    # Recruiter Side Ranking
    # -------------------------

    def filter_and_rank_candidates(
        self,
        job: Dict,
        applications: List[Dict],
        top_n: int = 10
    ):

        candidates = []

        for app in applications:
            cand = app.get("candidate_json", {})

            if not cand.get("skills"):
                continue

            score = self.calculate_score(cand, job)

            if not score["matched_skills"]:
                continue

            candidates.append({
                "candidate_id": app["candidate_profile_id"],
                "application_id": app["id"],
                "name": cand.get("name"),
                "email": cand.get("email"),
                "skills": cand.get("skills"),
                "location": cand.get("current_location"),
                "match_score": score["match_score"],
                "matched_skills": score["matched_skills"],
                "missing_skills": score["missing_skills"]
            })

        candidates.sort(key=lambda x: x["match_score"], reverse=True)

        return candidates[:top_n], {
            "total_applied": len(applications),
            "final_returned": len(candidates[:top_n])
        }


# Singleton instance
recommender = Recommender()
