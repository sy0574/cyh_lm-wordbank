/**
 * API client for handling data fetching with retry functionality
 */

// Type definitions for our data
export interface Student {
  id: number;
  name: string;
  accuracy: number;
  responseTime: number;
  grade: string;
  scoreHistory: Array<{
    date: string;
    score: number;
  }>;
}

export interface RankingData {
  id: number;
  name: string;
  score: number;
  responseTime: number;
  avatar?: string;
}

export interface MatchData {
  classId: string;
  students: Student[];
  rankings: RankingData[];
}

// Helper function to wait a specific amount of time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch match data with retry functionality
 */
export async function fetchMatchData(classId: string, retries = 2): Promise<MatchData | null> {
  if (!classId) {
    console.warn('fetchMatchData called with empty classId');
    return null;
  }
  
  const requestId = Math.random().toString(36).substring(2, 8);
  console.log(`[API-CLIENT-${requestId}] Fetching match data for class: ${classId}`);
  
  let lastError: Error | null = null;
  
  // Try the request up to 'retries' times
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        // Wait before retrying - exponential backoff
        const waitTime = Math.min(100 * Math.pow(2, attempt), 3000);
        console.log(`[API-CLIENT-${requestId}] Retry attempt ${attempt}, waiting ${waitTime}ms...`);
        await delay(waitTime);
      }
      
      // Ensure we're not getting a cached response
      const timestamp = new Date().getTime();
      const url = `/api/match-summary?classId=${encodeURIComponent(classId)}&_t=${timestamp}`;
      console.log(`[API-CLIENT-${requestId}] Fetching from URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate the response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format: expected an object');
      }
      
      if (!Array.isArray(data.students) || !Array.isArray(data.rankings)) {
        console.warn(`[API-CLIENT-${requestId}] Unexpected data structure:`, data);
        throw new Error('Invalid response format: missing students or rankings arrays');
      }
      
      console.log(`[API-CLIENT-${requestId}] Successfully fetched data: students=${data.students.length}, rankings=${data.rankings.length}`);
      
      return data as MatchData;
    } catch (error) {
      lastError = error as Error;
      console.error(`[API-CLIENT-${requestId}] Attempt ${attempt + 1}/${retries + 1} failed:`, error);
    }
  }
  
  // If we get here, all retries failed
  console.error(`[API-CLIENT-${requestId}] All ${retries + 1} attempts failed for class ${classId}`);
  throw lastError || new Error(`Failed to fetch match data for ${classId} after ${retries + 1} attempts`);
} 