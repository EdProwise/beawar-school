export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      about_content: {
        Row: {
          created_at: string | null
          history_text: string | null
          id: string
          main_description: string | null
          main_heading: string | null
          main_image_url: string | null
          mission_text: string | null
          mission_title: string | null
          secondary_image_url: string | null
          section_subtitle: string | null
          section_title: string | null
          updated_at: string | null
          vision_text: string | null
          vision_title: string | null
          years_of_excellence: number | null
        }
        Insert: {
          created_at?: string | null
          history_text?: string | null
          id?: string
          main_description?: string | null
          main_heading?: string | null
          main_image_url?: string | null
          mission_text?: string | null
          mission_title?: string | null
          secondary_image_url?: string | null
          section_subtitle?: string | null
          section_title?: string | null
          updated_at?: string | null
          vision_text?: string | null
          vision_title?: string | null
          years_of_excellence?: number | null
        }
        Update: {
          created_at?: string | null
          history_text?: string | null
          id?: string
          main_description?: string | null
          main_heading?: string | null
          main_image_url?: string | null
          mission_text?: string | null
          mission_title?: string | null
          secondary_image_url?: string | null
          section_subtitle?: string | null
          section_title?: string | null
          updated_at?: string | null
          vision_text?: string | null
          vision_title?: string | null
          years_of_excellence?: number | null
        }
        Relationships: []
      }
      academic_programs: {
        Row: {
          created_at: string | null
          description: string | null
          features: string[] | null
          grade_range: string | null
          icon_name: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          sort_order: number | null
          subtitle: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          grade_range?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          subtitle?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          grade_range?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      admission_faqs: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          is_active: boolean | null
          question: string
          sort_order: number | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question: string
          sort_order?: number | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      admission_inquiries: {
        Row: {
          created_at: string | null
          email: string
          grade_applying: string
          id: string
          message: string | null
          parent_name: string
          phone: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          grade_applying: string
          id?: string
          message?: string | null
          parent_name: string
          phone: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          grade_applying?: string
          id?: string
          message?: string | null
          parent_name?: string
          phone?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admission_requirements: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          items: string[]
          sort_order: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          items: string[]
          sort_order?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          items?: string[]
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      admission_steps: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          step_number: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          step_number: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          step_number?: number
          title?: string
        }
        Relationships: []
      }
      admissions_content: {
        Row: {
          created_at: string | null
          id: string
          intro_text: string | null
          page_subtitle: string | null
          page_title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          intro_text?: string | null
          page_subtitle?: string | null
          page_title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          intro_text?: string | null
          page_subtitle?: string | null
          page_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          message: string
          phone: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          message: string
          phone?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string
          phone?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      facilities: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          sort_order: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_published: boolean | null
          sort_order: number | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_published?: boolean | null
          sort_order?: number | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_published?: boolean | null
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          created_at: string | null
          cta_primary_link: string | null
          cta_primary_text: string | null
          cta_secondary_link: string | null
          cta_secondary_text: string | null
          id: string
          image_url: string
          is_active: boolean | null
          sort_order: number | null
          subtitle: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          cta_primary_link?: string | null
          cta_primary_text?: string | null
          cta_secondary_link?: string | null
          cta_secondary_text?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          sort_order?: number | null
          subtitle?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          cta_primary_link?: string | null
          cta_primary_text?: string | null
          cta_secondary_link?: string | null
          cta_secondary_text?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      highlight_cards: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          sort_order: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      legal_pages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          last_updated: string | null
          page_title: string
          page_type: string
          sections: Json | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          last_updated?: string | null
          page_title: string
          page_type: string
          sections?: Json | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          last_updated?: string | null
          page_title?: string
          page_type?: string
          sections?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: string | null
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          mime_type: string | null
          original_name: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          mime_type?: string | null
          original_name: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          mime_type?: string | null
          original_name?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      news_events: {
        Row: {
          author_id: string | null
          category: string
          content: string | null
          created_at: string | null
          event_date: string | null
          event_location: string | null
          event_time: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content?: string | null
          created_at?: string | null
          event_date?: string | null
          event_location?: string | null
          event_time?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string | null
          created_at?: string | null
          event_date?: string | null
          event_location?: string | null
          event_time?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          page_slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          page_slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          page_slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      portal_content: {
        Row: {
          created_at: string | null
          features: string[] | null
          id: string
          intro_text: string | null
          is_active: boolean | null
          login_url: string | null
          page_subtitle: string | null
          page_title: string
          portal_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: string[] | null
          id?: string
          intro_text?: string | null
          is_active?: boolean | null
          login_url?: string | null
          page_subtitle?: string | null
          page_title: string
          portal_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: string[] | null
          id?: string
          intro_text?: string | null
          is_active?: boolean | null
          login_url?: string | null
          page_subtitle?: string | null
          page_title?: string
          portal_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string | null
          address: string | null
          apply_link: string | null
          apply_text: string | null
          created_at: string | null
          cta_primary_link: string | null
          cta_primary_text: string | null
          cta_secondary_link: string | null
          cta_secondary_text: string | null
          email: string | null
          facebook_url: string | null
          favicon_url: string | null
          footer_text: string | null
          id: string
          instagram_url: string | null
          logo_url: string | null
          map_embed_url: string | null
          office_hours_weekday: string | null
          office_hours_weekend: string | null
          phone: string | null
          phone_secondary: string | null
          portal_link: string | null
          portal_text: string | null
          primary_color: string | null
          school_name: string
          show_apply_button: boolean | null
          show_portal_button: boolean | null
            tagline: string | null
            linkedin_url: string | null
            updated_at: string | null
          whatsapp_number: string | null
          youtube_url: string | null
        }
        Insert: {
          accent_color?: string | null
          address?: string | null
          apply_link?: string | null
          apply_text?: string | null
          created_at?: string | null
          cta_primary_link?: string | null
          cta_primary_text?: string | null
          cta_secondary_link?: string | null
          cta_secondary_text?: string | null
          email?: string | null
          facebook_url?: string | null
          favicon_url?: string | null
          footer_text?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          map_embed_url?: string | null
          office_hours_weekday?: string | null
          office_hours_weekend?: string | null
          phone?: string | null
          phone_secondary?: string | null
          portal_link?: string | null
          portal_text?: string | null
          primary_color?: string | null
          school_name?: string
          show_apply_button?: boolean | null
          show_portal_button?: boolean | null
            tagline?: string | null
            linkedin_url?: string | null
            updated_at?: string | null
          whatsapp_number?: string | null
          youtube_url?: string | null
        }
        Update: {
          accent_color?: string | null
          address?: string | null
          apply_link?: string | null
          apply_text?: string | null
          created_at?: string | null
          cta_primary_link?: string | null
          cta_primary_text?: string | null
          cta_secondary_link?: string | null
          cta_secondary_text?: string | null
          email?: string | null
          facebook_url?: string | null
          favicon_url?: string | null
          footer_text?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          map_embed_url?: string | null
          office_hours_weekday?: string | null
          office_hours_weekend?: string | null
          phone?: string | null
          phone_secondary?: string | null
          portal_link?: string | null
          portal_text?: string | null
          primary_color?: string | null
          school_name?: string
          show_apply_button?: boolean | null
          show_portal_button?: boolean | null
            tagline?: string | null
            linkedin_url?: string | null
            updated_at?: string | null
          whatsapp_number?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      statistics: {
        Row: {
          created_at: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          label: string
          sort_order: number | null
          suffix: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          sort_order?: number | null
          suffix?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          sort_order?: number | null
          suffix?: string | null
          value?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_image: string | null
          author_name: string
          author_role: string
          created_at: string | null
          id: string
          is_published: boolean | null
          quote: string
          rating: number | null
          sort_order: number | null
        }
        Insert: {
          author_image?: string | null
          author_name: string
          author_role: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          quote: string
          rating?: number | null
          sort_order?: number | null
        }
        Update: {
          author_image?: string | null
          author_name?: string
          author_role?: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          quote?: string
          rating?: number | null
          sort_order?: number | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
