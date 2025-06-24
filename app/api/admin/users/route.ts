import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { CreateAdminUserSchema, PaginationSchema } from "@/lib/schemas"
import { ZodError } from "zod"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const validationResult = PaginationSchema.safeParse(Object.fromEntries(searchParams))

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Geçersiz sayfalama parametreleri.", details: validationResult.error.errors },
        { status: 400 },
      )
    }
    const { page, limit, search } = validationResult.data
    const offset = (page - 1) * limit

    let usersQuery = `
      SELECT 
        id, 
        username, 
        email, 
        first_name, 
        last_name, 
        role, 
        is_active, 
        last_login, 
        login_attempts,
        created_at,
        updated_at
      FROM admin_users
    `
    const queryParams: any[] = []

    if (search) {
      usersQuery += ` WHERE username ILIKE $${queryParams.length + 1} OR email ILIKE $${queryParams.length + 1}`
      queryParams.push(`%${search}%`)
    }

    const countQuery = `SELECT COUNT(*) FROM (${usersQuery.replace(/SELECT .*? FROM/s, "SELECT id FROM")}) AS subquery_count`
    const totalUsersResult = await sql.query(countQuery, queryParams)
    const totalUsers = Number(totalUsersResult[0].count)

    usersQuery += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`
    queryParams.push(limit, offset)

    const users = await sql.query(usersQuery, queryParams)

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        totalItems: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    })
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json({ error: "Kullanıcılar yüklenemedi." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateAdminUserSchema.parse(body)
    const { username, email, password, first_name, last_name, role, is_active } = validatedData

    const existingUser = await sql`
      SELECT id FROM admin_users 
      WHERE username = ${username} OR email = ${email}
    `

    if (existingUser.length > 0) {
      const field = existingUser[0].username === username ? "Kullanıcı adı" : "E-posta"
      return NextResponse.json({ error: `${field} zaten kullanımda.` }, { status: 409 })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUserResult = await sql`
      INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role, is_active)
      VALUES (${username}, ${email}, ${passwordHash}, ${first_name || ""}, ${last_name || ""}, ${role}, ${is_active})
      RETURNING id, username, email, first_name, last_name, role, is_active, created_at
    `

    const newUser = newUserResult[0]
    // Dönen veriden hassas bilgileri çıkar (password_hash)
    const { password_hash, ...userToReturn } = newUser

    return NextResponse.json(userToReturn, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Geçersiz kullanıcı verisi.", details: error.errors }, { status: 400 })
    }
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Kullanıcı oluşturulamadı." }, { status: 500 })
  }
}
