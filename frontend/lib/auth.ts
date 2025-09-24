import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { query } from "./db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface User {
  id: string
  email: string
  role: "admin" | "user"
  full_name?: string
  created_at: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch {
    return null
  }
}

export async function getUser(request?: NextRequest): Promise<User | null> {
  let token: string | undefined

  if (request) {
    // For middleware
    token = request.cookies.get("auth-token")?.value
  } else {
    // For server components
    const cookieStore = await cookies()
    token = cookieStore.get("auth-token")?.value
  }

  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded) return null

  // Get full user data from database
  const { data, error } = await query("SELECT id, email, role, full_name, created_at FROM profiles WHERE id = $1", [
    decoded.id,
  ])

  if (error || !data || data.length === 0) return null

  return data[0] as User
}

export async function createUser(
  email: string,
  password: string,
  fullName?: string,
): Promise<{ user: User | null; error: string | null }> {
  try {
    // Check if user already exists
    const { data: existingUser } = await query("SELECT id FROM profiles WHERE email = $1", [email])

    if (existingUser && existingUser.length > 0) {
      return { user: null, error: "User already exists" }
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const userId = crypto.randomUUID()

    const { data, error } = await query(
      `INSERT INTO profiles (id, email, password_hash, full_name, role, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) 
       RETURNING id, email, role, full_name, created_at`,
      [userId, email, hashedPassword, fullName || "", "user"],
    )

    if (error || !data || data.length === 0) {
      return { user: null, error: "Failed to create user" }
    }

    return { user: data[0] as User, error: null }
  } catch (error) {
    return { user: null, error: "Internal server error" }
  }
}

export async function signInUser(
  email: string,
  password: string,
): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await query(
      "SELECT id, email, password_hash, role, full_name, created_at FROM profiles WHERE email = $1",
      [email],
    )

    if (error || !data || data.length === 0) {
      return { user: null, error: "Invalid credentials" }
    }

    const user = data[0]
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return { user: null, error: "Invalid credentials" }
    }

    // Remove password_hash from returned user
    const { password_hash, ...userWithoutPassword } = user
    return { user: userWithoutPassword as User, error: null }
  } catch (error) {
    return { user: null, error: "Internal server error" }
  }
}
