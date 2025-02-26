import { NextRequest, NextResponse } from 'next/server';

// Mock database service - replace with your actual database logic
const getMatchDataFromDatabase = async (classId: string) => {
  console.log(`[DB] Getting match data for class: ${classId}`);
  
  try {
    // Simulate database query - replace with your actual database queries
    
    // For testing, let's simulate different responses for different classes
    if (classId === 'test') {
      console.log(`[DB] Returning mock data for 'test' class`);
      return {
        classId: 'test',
        students: [
          {
            id: 1,
            name: 'Carl',
            accuracy: 100,
            responseTime: 1105,
            grade: 'A',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 150 + Math.floor(Math.random() * 50 - 25)
            }))
          },
          {
            id: 2,
            name: 'Jenny',
            accuracy: 95,
            responseTime: 1620,
            grade: 'A-',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 140 + Math.floor(Math.random() * 50 - 25)
            }))
          },
          {
            id: 3,
            name: 'Jack',
            accuracy: 98,
            responseTime: 1080,
            grade: 'A+',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 160 + Math.floor(Math.random() * 50 - 25)
            }))
          },
          {
            id: 4,
            name: 'Forrest',
            accuracy: 87,
            responseTime: 4374,
            grade: 'B',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 130 + Math.floor(Math.random() * 50 - 25)
            }))
          },
          {
            id: 5,
            name: 'Rose',
            accuracy: 92,
            responseTime: 1420,
            grade: 'A-',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 145 + Math.floor(Math.random() * 50 - 25)
            }))
          }
        ],
        rankings: [
          { id: 3, name: 'Jack', score: 3440, responseTime: 1080 },
          { id: 1, name: 'Carl', score: 3392, responseTime: 1105 },
          { id: 5, name: 'Rose', score: 3280, responseTime: 1420 },
          { id: 2, name: 'Jenny', score: 3232, responseTime: 1620 },
          { id: 4, name: 'Forrest', score: 2953, responseTime: 4374 }
        ]
      };
    } else if (classId === 'G7-Sat') {
      console.log(`[DB] Returning mock data for 'G7-Sat' class`);
      return {
        classId: 'G7-Sat',
        students: [
          {
            id: 22,
            name: 'TinaZ',
            accuracy: 94,
            responseTime: 1302,
            grade: 'A-',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 145 + Math.floor(Math.random() * 50 - 25)
            }))
          },
          {
            id: 24,
            name: 'Felix',
            accuracy: 97,
            responseTime: 1150,
            grade: 'A',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 155 + Math.floor(Math.random() * 50 - 25)
            }))
          },
          {
            id: 25,
            name: 'LucasZ',
            accuracy: 91,
            responseTime: 1480,
            grade: 'B+',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 140 + Math.floor(Math.random() * 50 - 25)
            }))
          },
          {
            id: 26,
            name: 'Nancy',
            accuracy: 96,
            responseTime: 1210,
            grade: 'A',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 152 + Math.floor(Math.random() * 50 - 25)
            }))
          },
          {
            id: 11,
            name: 'Mark',
            accuracy: 89,
            responseTime: 1950,
            grade: 'B',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 135 + Math.floor(Math.random() * 50 - 25)
            }))
          },
          {
            id: 14,
            name: 'Kiki',
            accuracy: 98,
            responseTime: 1050,
            grade: 'A+',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 165 + Math.floor(Math.random() * 50 - 25)
            }))
          },
          {
            id: 12,
            name: 'Jackie',
            accuracy: 90,
            responseTime: 1750,
            grade: 'B+',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 138 + Math.floor(Math.random() * 50 - 25)
            }))
          },
          {
            id: 10,
            name: 'Robin',
            accuracy: 93,
            responseTime: 1350,
            grade: 'A-',
            scoreHistory: Array.from({ length: 20 }, (_, i) => ({
              date: `Day ${i+1}`,
              score: 142 + Math.floor(Math.random() * 50 - 25)
            }))
          }
        ],
        rankings: [
          { id: 14, name: 'Kiki', score: 3580, responseTime: 1050 },
          { id: 24, name: 'Felix', score: 3520, responseTime: 1150 },
          { id: 26, name: 'Nancy', score: 3450, responseTime: 1210 },
          { id: 22, name: 'TinaZ', score: 3380, responseTime: 1302 },
          { id: 10, name: 'Robin', score: 3320, responseTime: 1350 },
          { id: 25, name: 'LucasZ', score: 3250, responseTime: 1480 },
          { id: 12, name: 'Jackie', score: 3100, responseTime: 1750 },
          { id: 11, name: 'Mark', score: 3050, responseTime: 1950 }
        ]
      };
    } else {
      // If we don't have data for this class, return empty data with the correct structure
      console.log(`[DB] No predefined data for class '${classId}', returning empty structure`);
      return {
        classId,
        students: [],
        rankings: []
      };
    }
  } catch (error) {
    console.error(`[DB ERROR] Database error for class ${classId}:`, error);
    throw new Error(`Failed to fetch data from database for class: ${classId}`);
  }
};

// Use a simple response format without Next.js types to avoid import issues
export async function GET(request) {
  // For debugging
  const requestId = Math.random().toString(36).substring(2, 10);
  console.log(`[API-${requestId}] Received match-summary request`);
  
  try {
    // Get the classId from the URL
    const url = new URL(request.url);
    const classId = url.searchParams.get('classId');
    
    console.log(`[API-${requestId}] Request params: classId=${classId}`);
    
    if (!classId) {
      console.warn(`[API-${requestId}] Missing classId parameter`);
      return new Response(
        JSON.stringify({ error: 'Missing classId parameter' }),
        { 
          status: 400, 
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0',
          }
        }
      );
    }

    // Fetch the data from our database (or mock data for now)
    console.log(`[API-${requestId}] Fetching data for class: ${classId}`);
    const matchData = await getMatchDataFromDatabase(classId);
    
    // Log what we're sending back for debugging
    console.log(`[API-${requestId}] Returning data for class ${classId}: students=${matchData.students.length}, rankings=${matchData.rankings.length}`);
    
    // Return the data with proper headers
    return new Response(
      JSON.stringify(matchData), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  } catch (error) {
    console.error(`[API-ERROR-${requestId}]`, error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unknown error occurred',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  }
} 