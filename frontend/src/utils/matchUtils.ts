/**
 * Unified match score calculation utilities
 * Ensures consistent match percentage calculations across the entire app
 */

export const calculateMatchPercentage = (
  candidateSkills: string[] = [],
  jobSkills: string[] = []
): number => {
  if (!candidateSkills || !candidateSkills.length || !jobSkills || !jobSkills.length) {
    return 0
  }

  const candidate = candidateSkills.map(s => String(s).toLowerCase().trim())
  const job = jobSkills.map(s => String(s).toLowerCase().trim())

  const matches = candidate.filter(skill => job.includes(skill))

  const percentage = Math.min(matches.length / job.length, 1) * 100

  return Math.round(percentage)
}

export const getSkillMatches = (
  candidateSkills: string[] = [],
  jobSkills: string[] = []
) => {
  const candidate = (candidateSkills || []).map(s => String(s).toLowerCase().trim())
  const job = (jobSkills || []).map(s => String(s).toLowerCase().trim())

  const matching = job.filter(skill => candidate.includes(skill))
  const missing = job.filter(skill => !candidate.includes(skill))

  return {
    matching,
    missing
  }
}
