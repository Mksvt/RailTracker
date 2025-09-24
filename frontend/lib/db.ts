import { neon } from "@neondatabase/serverless"

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set")
}

export const sql = neon(process.env.POSTGRES_URL)

// Database query helpers
export async function query(text: string, params?: any[]) {
  try {
    const result = await sql(text, params)
    return { data: result, error: null }
  } catch (error) {
    console.error("Database query error:", error)
    return { data: null, error: error as Error }
  }
}

// Helper functions for common operations
export async function getStations() {
  return query("SELECT id, name, code, city FROM stations ORDER BY name")
}

export async function getTrains() {
  return query("SELECT * FROM trains ORDER BY number")
}

export async function getSchedules(fromStationId?: string, toStationId?: string) {
  let queryText = `
    SELECT 
      ts.*,
      t.number as train_number,
      t.name as train_name,
      t.type as train_type,
      fs.name as from_station_name,
      fs.code as from_station_code,
      ts_dest.name as to_station_name,
      ts_dest.code as to_station_code
    FROM train_schedules ts
    JOIN trains t ON ts.train_id = t.id
    JOIN stations fs ON ts.from_station_id = fs.id
    JOIN stations ts_dest ON ts.to_station_id = ts_dest.id
  `

  const params: any[] = []

  if (fromStationId && toStationId) {
    queryText += " WHERE ts.from_station_id = $1 AND ts.to_station_id = $2"
    params.push(fromStationId, toStationId)
  } else if (fromStationId) {
    queryText += " WHERE ts.from_station_id = $1"
    params.push(fromStationId)
  } else if (toStationId) {
    queryText += " WHERE ts.to_station_id = $1"
    params.push(toStationId)
  }

  queryText += " ORDER BY ts.departure_time"

  return query(queryText, params)
}

export async function getLiveUpdates() {
  return query(`
    SELECT 
      lu.*,
      t.number as train_number,
      t.name as train_name,
      fs.name as from_station_name,
      ts_dest.name as to_station_name
    FROM live_updates lu
    JOIN trains t ON lu.train_id = t.id
    JOIN stations fs ON lu.from_station_id = fs.id
    JOIN stations ts_dest ON lu.to_station_id = ts_dest.id
    ORDER BY lu.created_at DESC
    LIMIT 10
  `)
}
