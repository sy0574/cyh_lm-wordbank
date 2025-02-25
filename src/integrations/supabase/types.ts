export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_opponents: {
        Row: {
          avatar_seed: string
          created_at: string
          difficulty_level: string
          id: string
          name: string
        }
        Insert: {
          avatar_seed: string
          created_at?: string
          difficulty_level: string
          id?: string
          name: string
        }
        Update: {
          avatar_seed?: string
          created_at?: string
          difficulty_level?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          average_response_time: number | null
          correct_answers: number
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          ended_at: string | null
          fastest_response_time: number | null
          id: string
          incorrect_answers: number
          language: string
          started_at: string | null
          student_id: string
          total_score: number
        }
        Insert: {
          average_response_time?: number | null
          correct_answers?: number
          created_at?: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          ended_at?: string | null
          fastest_response_time?: number | null
          id?: string
          incorrect_answers?: number
          language: string
          started_at?: string | null
          student_id: string
          total_score?: number
        }
        Update: {
          average_response_time?: number | null
          correct_answers?: number
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          ended_at?: string | null
          fastest_response_time?: number | null
          id?: string
          incorrect_answers?: number
          language?: string
          started_at?: string | null
          student_id?: string
          total_score?: number
        }
        Relationships: []
      }
      match_history: {
        Row: {
          answer_number: number
          answered_at: string | null
          correct: boolean
          difficulty: string
          id: string
          points_earned: number
          response_time: number
          student_id: string
          word: string
        }
        Insert: {
          answer_number: number
          answered_at?: string | null
          correct: boolean
          difficulty: string
          id?: string
          points_earned: number
          response_time: number
          student_id: string
          word: string
        }
        Update: {
          answer_number?: number
          answered_at?: string | null
          correct?: boolean
          difficulty?: string
          id?: string
          points_earned?: number
          response_time?: number
          student_id?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_student_id_fkey1"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_seed: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_seed?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_seed?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      student_word_mastery: {
        Row: {
          average_response_time: number | null
          correct_attempts: number
          created_at: string | null
          fastest_response_time: number | null
          id: string
          incorrect_attempts: number
          last_attempt_at: string | null
          mastery_level: number
          student_id: string
          total_attempts: number
          updated_at: string | null
          word_id: string
        }
        Insert: {
          average_response_time?: number | null
          correct_attempts?: number
          created_at?: string | null
          fastest_response_time?: number | null
          id?: string
          incorrect_attempts?: number
          last_attempt_at?: string | null
          mastery_level?: number
          student_id: string
          total_attempts?: number
          updated_at?: string | null
          word_id: string
        }
        Update: {
          average_response_time?: number | null
          correct_attempts?: number
          created_at?: string | null
          fastest_response_time?: number | null
          id?: string
          incorrect_attempts?: number
          last_attempt_at?: string | null
          mastery_level?: number
          student_id?: string
          total_attempts?: number
          updated_at?: string | null
          word_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          avatar: string | null
          class: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          avatar?: string | null
          class: string
          created_at?: string
          id: string
          name: string
        }
        Update: {
          avatar?: string | null
          class?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      vocabulary_words: {
        Row: {
          created_at: string
          definition: string
          difficulty_level: string
          id: number
          option1: string
          option2: string
          option3: string
          option4: string
          word: string
        }
        Insert: {
          created_at?: string
          definition: string
          difficulty_level: string
          id?: never
          option1: string
          option2: string
          option3: string
          option4: string
          word: string
        }
        Update: {
          created_at?: string
          definition?: string
          difficulty_level?: string
          id?: never
          option1?: string
          option2?: string
          option3?: string
          option4?: string
          word?: string
        }
        Relationships: []
      }
      word_attempts: {
        Row: {
          attempt_number: number
          created_at: string | null
          game_session_id: string | null
          id: string
          is_correct: boolean
          response_time_seconds: number
          student_id: string
          word_id: string
        }
        Insert: {
          attempt_number: number
          created_at?: string | null
          game_session_id?: string | null
          id?: string
          is_correct: boolean
          response_time_seconds: number
          student_id: string
          word_id: string
        }
        Update: {
          attempt_number?: number
          created_at?: string | null
          game_session_id?: string | null
          id?: string
          is_correct?: boolean
          response_time_seconds?: number
          student_id?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "word_attempts_game_session_id_fkey"
            columns: ["game_session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      words: {
        Row: {
          category: string
          chinese_definition: string
          created_at: string
          examples: string[]
          frequency: string
          id: string
          part_of_speech: string
          pronunciation: string
          textbook: string
          word: string
        }
        Insert: {
          category: string
          chinese_definition: string
          created_at?: string
          examples: string[]
          frequency: string
          id: string
          part_of_speech: string
          pronunciation: string
          textbook: string
          word: string
        }
        Update: {
          category?: string
          chinese_definition?: string
          created_at?: string
          examples?: string[]
          frequency?: string
          id?: string
          part_of_speech?: string
          pronunciation?: string
          textbook?: string
          word?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_level: "beginner" | "intermediate" | "advanced"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
