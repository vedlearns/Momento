import type { Moment } from '../types/types'

const images = {
  night: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85',
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
  ocean: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80',
  city: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80',
  desert: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=80',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80',
  coast: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=900&q=80',
  snow: 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=900&q=80',
  nightcity: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80',
  space: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80',
  road: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  architecture: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80',
}

export const featured: Moment = {
  id: 'night-shift',
  title: 'Night Shift',
  eyebrow: 'A MOMENTO ORIGINAL SERIES',
  description: 'A forensic analyst by day moonlights as a vigilante who hunts down criminals the law can’t touch in a sun-soaked coastal city.',
  year: 2026,
  rating: '16+',
  seasons: '8 episodes',
  genre: 'Crime · Thriller',
  image: images.night,
  backdrop: images.night,
  accent: '#e11d35',
  match: 98,
}

export const catalogue: Moment[] = [
  { id: 'blue-hour', title: 'The Blue Hour', description: 'A quiet coastal town hides a secret that surfaces after sunset.', year: 2025, rating: '13+', genre: 'Mystery', image: images.ocean, accent: '#137fa0', match: 96 },
  { id: 'wild-earth', title: 'Wild Earth', description: 'A breathtaking journey through the last untamed places on Earth.', year: 2024, rating: 'All', genre: 'Documentary', image: images.mountain, accent: '#31785e', match: 94, badge: 'TOP 10' },
  { id: 'afterglow', title: 'Afterglow', description: 'Two strangers meet at the edge of a city that never sleeps.', year: 2026, rating: '16+', genre: 'Drama', image: images.nightcity, accent: '#8338a8', match: 91 },
  { id: 'red-sands', title: 'Red Sands', description: 'One missing traveller. Three stories. A desert full of lies.', year: 2025, rating: '16+', genre: 'Thriller', image: images.desert, accent: '#bd571e', match: 89 },
  { id: 'greenline', title: 'Greenline', description: 'A ranger discovers an impossible pattern deep in the forest.', year: 2024, rating: '13+', genre: 'Adventure', image: images.forest, accent: '#1d785b', match: 93 },
  { id: 'the-long-way', title: 'The Long Way', description: 'A road trip becomes a second chance at an unfinished life.', year: 2023, rating: '13+', genre: 'Drama', image: images.road, accent: '#b51b58', match: 90 },
  { id: 'cold-front', title: 'Cold Front', description: 'Cut off by a blizzard, a remote crew begins to disappear.', year: 2026, rating: '16+', genre: 'Mystery', image: images.snow, accent: '#2458a7', match: 97 },
  { id: 'orbit', title: 'Orbit Unknown', description: 'A signal from deep space changes everything we know.', year: 2025, rating: '13+', genre: 'Sci-fi', image: images.space, accent: '#5e38ad', match: 95 },
  { id: 'last-light', title: 'Last Light', description: 'A photographer returns home to capture one final summer.', year: 2024, rating: 'All', genre: 'Romance', image: images.coast, accent: '#177b87', match: 87 },
  { id: 'glass-house', title: 'Glass House', description: 'Behind a perfect facade, everyone has something to hide.', year: 2026, rating: '16+', genre: 'Thriller', image: images.architecture, accent: '#9b293d', match: 92 },
]

export const continueWatching: Moment[] = [
  { ...catalogue[2], id: 'continue-afterglow', title: 'Afterglow', progress: 68 },
  { ...catalogue[7], id: 'continue-orbit', title: 'Orbit Unknown', progress: 32 },
  { ...catalogue[3], id: 'continue-red-sands', title: 'Red Sands', progress: 81 },
  { ...catalogue[4], id: 'continue-greenline', title: 'Greenline', progress: 46 },
  { ...catalogue[6], id: 'continue-cold-front', title: 'Cold Front', progress: 15 },
]

export const kidsAndFamily: Moment[] = [
  { ...catalogue[4], id: 'family-wild', title: 'Wild Wonders', rating: 'All' },
  { ...catalogue[8], id: 'family-last-light', title: 'Ocean Friends', rating: 'All' },
  { ...catalogue[0], id: 'family-blue', title: 'Little Blue Planet', rating: 'All' },
  { ...catalogue[1], id: 'family-earth', title: 'Tiny Giants', rating: 'All' },
  { ...catalogue[5], id: 'family-road', title: 'The Big Adventure', rating: 'All', badge: 'TOP 10' },
]

export const topTen = catalogue.slice(6).concat(catalogue.slice(0, 2))
export const trending = [catalogue[9], catalogue[1], catalogue[6], catalogue[2], catalogue[0], catalogue[7]]
