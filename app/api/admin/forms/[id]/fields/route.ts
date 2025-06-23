import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formId = Number.parseInt(params.id)

    const fields = await sql`
      SELECT * FROM form_fields 
      WHERE form_id = ${formId} 
      ORDER BY field_order ASC
    `

    return NextResponse.json(fields)
  } catch (error) {
    console.error("Error fetching form fields:", error)
    return NextResponse.json({ error: "Form alanları yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formId = Number.parseInt(params.id)
    const fieldData = await request.json()

    const result = await sql`
      INSERT INTO form_fields (
        form_id, field_name, field_label, field_type, field_options,
        is_required, placeholder, help_text, validation_rules, field_order
      ) VALUES (
        ${formId}, ${fieldData.field_name}, ${fieldData.field_label}, 
        ${fieldData.field_type}, ${JSON.stringify(fieldData.field_options || {})},
        ${fieldData.is_required || false}, ${fieldData.placeholder || ""}, 
        ${fieldData.help_text || ""}, ${JSON.stringify(fieldData.validation_rules || {})},
        ${fieldData.field_order || 1}
      ) RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating form field:", error)
    return NextResponse.json({ error: "Form alanı oluşturulamadı" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formId = Number.parseInt(params.id)
    const { fields } = await request.json()

    // Update all fields for the form
    const queries = fields.map((field: any) => {
      if (field.id) {
        // Update existing field
        return sql`
          UPDATE form_fields SET
            field_name = ${field.field_name},
            field_label = ${field.field_label},
            field_type = ${field.field_type},
            field_options = ${JSON.stringify(field.field_options || {})},
            is_required = ${field.is_required || false},
            placeholder = ${field.placeholder || ""},
            help_text = ${field.help_text || ""},
            validation_rules = ${JSON.stringify(field.validation_rules || {})},
            field_order = ${field.field_order || 1},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${field.id} AND form_id = ${formId}
          RETURNING *
        `
      } else {
        // Create new field
        return sql`
          INSERT INTO form_fields (
            form_id, field_name, field_label, field_type, field_options,
            is_required, placeholder, help_text, validation_rules, field_order
          ) VALUES (
            ${formId}, ${field.field_name}, ${field.field_label}, 
            ${field.field_type}, ${JSON.stringify(field.field_options || {})},
            ${field.is_required || false}, ${field.placeholder || ""}, 
            ${field.help_text || ""}, ${JSON.stringify(field.validation_rules || {})},
            ${field.field_order || 1}
          ) RETURNING *
        `
      }
    })

    const results = await Promise.all(queries)
    const updatedFields = results.map((result) => result[0])

    return NextResponse.json(updatedFields)
  } catch (error) {
    console.error("Error updating form fields:", error)
    return NextResponse.json({ error: "Form alanları güncellenemedi" }, { status: 500 })
  }
}
