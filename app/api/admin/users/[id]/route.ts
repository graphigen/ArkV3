import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { UpdateAdminUserSchema, IdSchema } from "@/lib/schemas"
import { ZodError } from "zod"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paramsValidation = IdSchema.safeParse(params)
    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Geçersiz ID formatı.", details: paramsValidation.error.errors },
        { status: 400 },
      )
    }
    const userId = paramsValidation.data.id

    const userResult = await sql`
      SELECT 
        id, 
        username, 
        email, 
        first_name, 
        last_name, 
        role, 
        is_active, 
        last_login, 
        created_at,
        updated_at
      FROM admin_users 
      WHERE id = ${userId}
    `

    if (userResult.length === 0) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 })
    }

    // Dönen veriden hassas bilgileri çıkar (password_hash)
    const { password_hash, ...userToReturn } = userResult[0]

    return NextResponse.json(userToReturn)
  } catch (error) {
    console.error("User fetch error:", error)
    return NextResponse.json({ error: "Kullanıcı yüklenemedi." }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paramsValidation = IdSchema.safeParse(params)
    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Geçersiz ID formatı.", details: paramsValidation.error.errors },
        { status: 400 },
      )
    }
    const userId = paramsValidation.data.id

    const body = await request.json()
    // Şifre güncellemesi ayrı bir endpoint veya özel bir alanla yapılmalı.
    // Bu şema şifre içermiyor.
    const { password, ...updateData } = body
    const validatedData = UpdateAdminUserSchema.parse(updateData)
    const { username, email, first_name, last_name, role, is_active } = validatedData

    // Kullanıcı adı veya e-posta değiştiriliyorsa, başkası tarafından kullanılıp kullanılmadığını kontrol et
    if (username || email) {
      const existingUserCheck = await sql`
            SELECT id, username, email FROM admin_users
            WHERE (username = ${username} OR email = ${email}) AND id != ${userId}
        `
      if (existingUserCheck.length > 0) {
        if (existingUserCheck[0].username === username) {
          return NextResponse.json(
            { error: "Bu kullanıcı adı zaten başka bir kullanıcı tarafından kullanılıyor." },
            { status: 409 },
          )
        }
        if (existingUserCheck[0].email === email) {
          return NextResponse.json(
            { error: "Bu e-posta adresi zaten başka bir kullanıcı tarafından kullanılıyor." },
            { status: 409 },
          )
        }
      }
    }

    let passwordUpdateSql = ""
    let passwordHash = null
    if (password) {
      if (typeof password !== "string" || password.length < 8) {
        return NextResponse.json({ error: "Yeni şifre en az 8 karakter olmalıdır." }, { status: 400 })
      }
      const salt = await bcrypt.genSalt(10)
      passwordHash = await bcrypt.hash(password, salt)
      passwordUpdateSql = `password_hash = \${passwordHash},`
    }

    const updatedUserResult = await sql`
      UPDATE admin_users 
      SET 
        username = COALESCE(${username}, username),
        email = COALESCE(${email}, email),
        first_name = COALESCE(${first_name}, first_name),
        last_name = COALESCE(${last_name}, last_name),
        role = COALESCE(${role}, role),
        is_active = COALESCE(${is_active}, is_active),
        ${passwordHash ? sql`password_hash = ${passwordHash},` : sql``}
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING id, username, email, first_name, last_name, role, is_active, updated_at
    `

    if (updatedUserResult.length === 0) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı veya güncellenemedi." }, { status: 404 })
    }

    const updatedUser = updatedUserResult[0]
    const { password_hash: _, ...userToReturn } = updatedUser

    return NextResponse.json(userToReturn)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Geçersiz kullanıcı verisi.", details: error.errors }, { status: 400 })
    }
    if (error instanceof Error && error.message.includes("unique constraint")) {
      if (error.message.includes("admin_users_username_key")) {
        return NextResponse.json({ error: "Bu kullanıcı adı zaten kullanımda." }, { status: 409 })
      }
      if (error.message.includes("admin_users_email_key")) {
        return NextResponse.json({ error: "Bu e-posta adresi zaten kullanımda." }, { status: 409 })
      }
      return NextResponse.json({ error: "Benzersizlik kısıtlaması ihlal edildi." }, { status: 409 })
    }
    console.error("User update error:", error)
    return NextResponse.json({ error: "Kullanıcı güncellenemedi." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paramsValidation = IdSchema.safeParse(params)
    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Geçersiz ID formatı.", details: paramsValidation.error.errors },
        { status: 400 },
      )
    }
    const userId = paramsValidation.data.id

    // Kendini silme kontrolü (opsiyonel ama iyi bir pratik)
    const currentUserIdHeader = request.headers.get("x-user-id")
    if (currentUserIdHeader && Number(currentUserIdHeader) === userId) {
      return NextResponse.json({ error: "Kendinizi silemezsiniz." }, { status: 403 })
    }

    const result = await sql`DELETE FROM admin_users WHERE id = ${userId} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı veya silinemedi." }, { status: 404 })
    }

    return NextResponse.json({ message: "Kullanıcı başarıyla silindi." })
  } catch (error) {
    console.error("User deletion error:", error)
    return NextResponse.json({ error: "Kullanıcı silinemedi." }, { status: 500 })
  }
}
