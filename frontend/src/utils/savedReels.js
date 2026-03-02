const SAVED_REELS_KEY = 'savedReelIds'

export const getSavedReelIds = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_REELS_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    return []
  }
}

export const storeSavedReelIds = (ids) => {
  localStorage.setItem(SAVED_REELS_KEY, JSON.stringify(ids))
}
