import { createClient } from '@supabase/supabase-js'

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'careeroai-auth-token',
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'CareeroAi',
    },
  },
})

// Auth helpers
export const auth = {
  /**
   * Sign up a new user
   */
  signUp: async (email: string, password: string, role: 'recruiter' | 'candidate') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
          },
        },
      })

      if (error) throw error

      // Insert user into public.users table
      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            role,
          })

        if (insertError) {
          console.error('Error inserting user:', insertError)
        }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Sign in existing user
   */
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Get user role from public.users
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (userError) {
          console.error('Error fetching user role:', userError)
          return { data, error: null, role: null }
        }

        return { data, error: null, role: userData.role }
      }

      return { data, error: null, role: null }
    } catch (error) {
      return { data: null, error, role: null }
    }
  },

  /**
   * Sign out current user
   */
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  /**
   * Get current session
   */
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Get current user
   */
  getUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Refresh session
   */
  refreshSession: async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
}

// Storage helpers
export const storage = {
  /**
   * Upload file to storage bucket
   */
  uploadFile: async (bucket: string, path: string, file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Get public URL for file
   */
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  },

  /**
   * Download file from storage
   */
  downloadFile: async (bucket: string, path: string) => {
    try {
      const { data, error } = await supabase.storage.from(bucket).download(path)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Delete file from storage
   */
  deleteFile: async (bucket: string, path: string) => {
    try {
      const { data, error } = await supabase.storage.from(bucket).remove([path])
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * List files in storage bucket
   */
  listFiles: async (bucket: string, folder?: string) => {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(folder)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
}

// Database helpers
export const db = {
  /**
   * Get data from table
   */
  select: async (table: string, columns = '*') => {
    try {
      const { data, error } = await supabase.from(table).select(columns)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Insert data into table
   */
  insert: async (table: string, data: any) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
      if (error) throw error
      return { data: result, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Update data in table
   */
  update: async (table: string, data: any, match: any) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .match(match)
        .select()
      if (error) throw error
      return { data: result, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Delete data from table
   */
  delete: async (table: string, match: any) => {
    try {
      const { data, error } = await supabase.from(table).delete().match(match)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
}

// Real-time subscriptions
export const realtime = {
  /**
   * Subscribe to table changes
   */
  subscribe: (
    table: string,
    callback: (payload: any) => void,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
  ) => {
    return supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
        },
        callback
      )
      .subscribe()
  },

  /**
   * Unsubscribe from channel
   */
  unsubscribe: (channel: any) => {
    supabase.removeChannel(channel)
  },
}

// Utility functions
export const utils = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: async () => {
    const { data } = await supabase.auth.getSession()
    return !!data.session
  },

  /**
   * Get user ID
   */
  getUserId: async () => {
    const { data } = await supabase.auth.getUser()
    return data.user?.id || null
  },

  /**
   * Get user role
   */
  getUserRole: async () => {
    const userId = await utils.getUserId()
    if (!userId) return null

    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    return data?.role || null
  },

  /**
   * Format error message
   */
  formatError: (error: any): string => {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.error_description) return error.error_description
    return 'An unexpected error occurred'
  },
}

// Export default Supabase client
export default supabase

// TypeScript types for better type safety
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'recruiter' | 'candidate'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'recruiter' | 'candidate'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'recruiter' | 'candidate'
          created_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          recruiter_id: string
          title: string
          description: string
          skills: string[]
          location: string | null
          job_type: string
          created_at: string
          updated_at: string
        }
      }
      candidate_profiles: {
        Row: {
          id: string
          user_id: string
          resume_json: Json
          portfolio_json: Json
          created_at: string
          updated_at: string
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string
          candidate_profile_id: string
          candidate_json: Json
          status: string
          created_at: string
        }
      }
      interviews: {
        Row: {
          id: string
          application_id: string
          video_url: string | null
          transcript: string | null
          score: Json
          created_at: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          application_id: string | null
          content: string
          read: boolean
          created_at: string
        }
      }
    }
  }
}

// Type-safe client
export type TypedSupabaseClient = typeof supabase