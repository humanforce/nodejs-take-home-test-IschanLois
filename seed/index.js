import { join } from 'node:path'

import axios from 'axios'
import dotenv from 'dotenv'

// CLEANUP API KEY!

dotenv.config({ path: join(import.meta.dirname, '.env') })

const axiosInstance = axios.create({
  baseURL: process.env.TBDB_API_URL || 'http://localhost:3000',
  timeout: 10000,
})

// 1. get top rated movies
const { data: { results: movies } } = await axiosInstance({
  method: 'get',
  url: '/movie/top_rated',
  params: { api_key: process.env.TMDB_API_KEY,  }
})

// 2. for each top rated movie get corresponding reviews
const reviewRequests = movies.map(({ id }) => axiosInstance({
  method: 'get',
  url: `/movie/${id}/reviews`,
  params: { api_key: process.env.TMDB_API_KEY },
}))

const reviewsResponses = (await Promise.all(reviewRequests))
  .map(({ data }) => ({ movieId: data.id, reviews: data.results }))

const movieCreditsRequests = movies.map(({ id }) => axiosInstance({
  method: 'get',
  url: `/movie/${id}/credits`,
  params: { api_key: process.env.TMDB_API_KEY },
}))

// 3. for each top rated movie get corresponding credits
const movieCreditsResponses = (await Promise.all(movieCreditsRequests))
  .map(({ data }) => ({ movieId: data.id, cast: data.cast, crew: data.crew }))


