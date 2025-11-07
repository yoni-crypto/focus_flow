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
          created_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          priority: 'low' | 'medium' | 'high'
          date: string
          due_time: string | null
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          priority?: 'low' | 'medium' | 'high'
          date: string
          due_time?: string | null
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          priority?: 'low' | 'medium' | 'high'
          date?: string
          due_time?: string | null
          completed?: boolean
          created_at?: string
        }
      }
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          start: string
          end_time: string | null
          duration_minutes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start: string
          end_time?: string | null
          duration_minutes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start?: string
          end_time?: string | null
          duration_minutes?: number | null
          created_at?: string
        }
      }
      money_entries: {
        Row: {
          id: string
          user_id: string
          type: 'spend' | 'save'
          amount: number
          category: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'spend' | 'save'
          amount: number
          category?: string | null
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'spend' | 'save'
          amount?: number
          category?: string | null
          date?: string
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          pinned: boolean
          archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          pinned?: boolean
          archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          pinned?: boolean
          archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

