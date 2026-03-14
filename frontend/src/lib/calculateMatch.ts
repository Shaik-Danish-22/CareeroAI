/**
 * Unified match score calculation function
 * Ensures consistent match percentages across the entire application
 */

export const calculateMatch = (
  candidateSkills: string[] | null | undefined,
  jobSkills: string[] | null | undefined
): number => {
  // Validate inputs
  if (!jobSkills || jobSkills.length === 0) {
    return 0
  }

  if (!candidateSkills || candidateSkills.length === 0) {
    return 0
  }

  // Convert both arrays to lowercase for case-insensitive comparison
  const candidateSkillsLower = candidateSkills.map(skill => skill.toLowerCase().trim())
  const jobSkillsLower = jobSkills.map(skill => skill.toLowerCase().trim())

  // Find intersection - count how many job skills the candidate has
  const matchedSkills = jobSkillsLower.filter(jobSkill =>
    candidateSkillsLower.some(candidateSkill => candidateSkill === jobSkill)
  )

  // Calculate percentage: matched / total required skills
  // Use Math.min to cap at 100%
  const matchPercentage = Math.min(
    (matchedSkills.length / jobSkillsLower.length) * 100,
    100
  )

  // Round to nearest integer
  return Math.round(matchPercentage)
}

/**
 * Get matched and missing skills
 * Returns arrays for UI display
 */
export const getSkillMatches = (
  candidateSkills: string[] | null | undefined,
  jobSkills: string[] | null | undefined
) => {
  if (!candidateSkills) candidateSkills = []
  if (!jobSkills) jobSkills = []

  const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase().trim())
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase().trim())

  const matched = jobSkills.filter(skill =>
    candidateSkillsLower.includes(skill.toLowerCase().trim())
  )

  const missing = jobSkills.filter(
    skill => !candidateSkillsLower.includes(skill.toLowerCase().trim())
  )

  return { matched, missing }
}
