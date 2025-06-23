import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface FormField {
  id: number
  form_id: number
  name: string
  label: string
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox" | "radio" | "file"
  placeholder?: string
  required: boolean
  options?: string[]
  validation_rules?: Record<string, any>
  order_index: number
  created_at: string
  updated_at: string
}

export interface Form {
  id: number
  name: string
  title: string
  description?: string
  slug: string
  status: "active" | "inactive"
  submit_message: string
  redirect_url?: string
  email_notifications: boolean
  notification_emails: string[]
  store_submissions: boolean
  fields?: FormField[]
  created_at: string
  updated_at: string
}

export interface FormSubmission {
  id: number
  form_id: number
  data: Record<string, any>
  ip_address?: string
  user_agent?: string
  referrer?: string
  status: "new" | "read" | "replied" | "spam"
  created_at: string
}

// Form CRUD Operations
export async function getAllForms(): Promise<Form[]> {
  try {
    const forms = await sql`
      SELECT 
        f.id, f.name, f.title, f.description, f.slug, f.status,
        f.submit_message, f.redirect_url, f.email_notifications, 
        f.notification_emails, f.store_submissions,
        f.created_at, f.updated_at
      FROM forms f 
      ORDER BY f.created_at DESC
    `

    // Get fields for each form
    for (const form of forms) {
      const fields = await sql`
        SELECT * FROM form_fields 
        WHERE form_id = ${form.id}
        ORDER BY order_index ASC
      `
      form.fields = fields
    }

    return forms as Form[]
  } catch (error) {
    console.error("Error fetching forms:", error)
    return []
  }
}

export async function getFormById(id: number): Promise<Form | null> {
  try {
    const [form] = await sql`
      SELECT * FROM forms WHERE id = ${id}
    `

    if (!form) return null

    const fields = await sql`
      SELECT * FROM form_fields 
      WHERE form_id = ${id}
      ORDER BY order_index ASC
    `

    return { ...form, fields } as Form
  } catch (error) {
    console.error("Error fetching form by id:", error)
    return null
  }
}

export async function getFormBySlug(slug: string): Promise<Form | null> {
  try {
    const [form] = await sql`
      SELECT * FROM forms WHERE slug = ${slug} AND status = 'active'
    `

    if (!form) return null

    const fields = await sql`
      SELECT * FROM form_fields 
      WHERE form_id = ${form.id}
      ORDER BY order_index ASC
    `

    return { ...form, fields } as Form
  } catch (error) {
    console.error("Error fetching form by slug:", error)
    return null
  }
}

export async function createForm(
  data: Omit<Form, "id" | "created_at" | "updated_at" | "fields">,
): Promise<Form | null> {
  try {
    const [form] = await sql`
      INSERT INTO forms (
        name, title, description, slug, submit_message, 
        redirect_url, email_notifications, notification_emails, 
        store_submissions, status
      )
      VALUES (
        ${data.name}, ${data.title}, ${data.description}, ${data.slug},
        ${data.submit_message}, ${data.redirect_url}, ${data.email_notifications},
        ${JSON.stringify(data.notification_emails)}, ${data.store_submissions}, ${data.status}
      )
      RETURNING *
    `

    return { ...form, fields: [] } as Form
  } catch (error) {
    console.error("Error creating form:", error)
    return null
  }
}

export async function updateForm(id: number, data: Partial<Form>): Promise<Form | null> {
  try {
    const [form] = await sql`
      UPDATE forms 
      SET 
        name = COALESCE(${data.name}, name),
        title = COALESCE(${data.title}, title),
        description = COALESCE(${data.description}, description),
        slug = COALESCE(${data.slug}, slug),
        submit_message = COALESCE(${data.submit_message}, submit_message),
        redirect_url = COALESCE(${data.redirect_url}, redirect_url),
        email_notifications = COALESCE(${data.email_notifications}, email_notifications),
        notification_emails = COALESCE(${JSON.stringify(data.notification_emails)}, notification_emails),
        store_submissions = COALESCE(${data.store_submissions}, store_submissions),
        status = COALESCE(${data.status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    const fields = await sql`
      SELECT * FROM form_fields 
      WHERE form_id = ${id}
      ORDER BY order_index ASC
    `

    return { ...form, fields } as Form
  } catch (error) {
    console.error("Error updating form:", error)
    return null
  }
}

export async function deleteForm(id: number): Promise<boolean> {
  try {
    await sql`DELETE FROM form_submissions WHERE form_id = ${id}`
    await sql`DELETE FROM form_fields WHERE form_id = ${id}`
    await sql`DELETE FROM forms WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting form:", error)
    return false
  }
}

// Form Submission Operations
export async function submitForm(
  formId: number,
  data: Record<string, any>,
  metadata?: {
    ip_address?: string
    user_agent?: string
    referrer?: string
  },
): Promise<FormSubmission | null> {
  try {
    const [submission] = await sql`
      INSERT INTO form_submissions (
        form_id, data, ip_address, user_agent, referrer, status
      )
      VALUES (
        ${formId}, ${JSON.stringify(data)}, ${metadata?.ip_address},
        ${metadata?.user_agent}, ${metadata?.referrer}, 'new'
      )
      RETURNING *
    `

    return submission as FormSubmission
  } catch (error) {
    console.error("Error submitting form:", error)
    return null
  }
}

export async function getFormSubmissions(
  formId: number,
  options: {
    page?: number
    limit?: number
    status?: FormSubmission["status"]
  } = {},
): Promise<{
  submissions: FormSubmission[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    const { page = 1, limit = 20, status } = options
    const offset = (page - 1) * limit

    let whereClause = `WHERE form_id = ${formId}`
    if (status) {
      whereClause += ` AND status = '${status}'`
    }

    const submissions = await sql`
      SELECT * FROM form_submissions 
      ${sql.unsafe(whereClause)}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const [{ count }] = await sql`
      SELECT COUNT(*) as count FROM form_submissions 
      ${sql.unsafe(whereClause)}
    `

    return {
      submissions: submissions as FormSubmission[],
      total: Number.parseInt(count),
      page,
      totalPages: Math.ceil(Number.parseInt(count) / limit),
    }
  } catch (error) {
    console.error("Error fetching form submissions:", error)
    return {
      submissions: [],
      total: 0,
      page: 1,
      totalPages: 0,
    }
  }
}
