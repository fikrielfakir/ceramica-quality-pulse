export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      app_modules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          module_key: string
          module_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          module_key: string
          module_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          module_key?: string
          module_name?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_system_setting: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_setting?: boolean | null
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_setting?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      compliance_documents: {
        Row: {
          created_at: string | null
          document_name: string
          document_type: string
          expiry_date: string | null
          file_url: string | null
          id: string
          issue_date: string | null
          issuing_authority: string | null
          status: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_name: string
          document_type: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_name?: string
          document_type?: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dimensional_surface_measurements: {
        Row: {
          created_at: string | null
          dimensional_test_id: string
          id: string
          is_conform: boolean | null
          max_gap: number | null
          measurement_type: string
          tolerance: number
          value_1: number | null
          value_10: number | null
          value_2: number | null
          value_3: number | null
          value_4: number | null
          value_5: number | null
          value_6: number | null
          value_7: number | null
          value_8: number | null
          value_9: number | null
          value_label: string | null
        }
        Insert: {
          created_at?: string | null
          dimensional_test_id: string
          id?: string
          is_conform?: boolean | null
          max_gap?: number | null
          measurement_type: string
          tolerance: number
          value_1?: number | null
          value_10?: number | null
          value_2?: number | null
          value_3?: number | null
          value_4?: number | null
          value_5?: number | null
          value_6?: number | null
          value_7?: number | null
          value_8?: number | null
          value_9?: number | null
          value_label?: string | null
        }
        Update: {
          created_at?: string | null
          dimensional_test_id?: string
          id?: string
          is_conform?: boolean | null
          max_gap?: number | null
          measurement_type?: string
          tolerance?: number
          value_1?: number | null
          value_10?: number | null
          value_2?: number | null
          value_3?: number | null
          value_4?: number | null
          value_5?: number | null
          value_6?: number | null
          value_7?: number | null
          value_8?: number | null
          value_9?: number | null
          value_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dimensional_surface_measurements_dimensional_test_id_fkey"
            columns: ["dimensional_test_id"]
            isOneToOne: false
            referencedRelation: "dimensional_surface_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      dimensional_surface_tests: {
        Row: {
          code: string
          controller_id: string | null
          created_at: string | null
          created_by: string | null
          defect_percent: number | null
          format: string | null
          id: string
          is_conform: boolean | null
          lighting_lux: number | null
          lot_id: string | null
          surface_tested: number | null
          test_date: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          code: string
          controller_id?: string | null
          created_at?: string | null
          created_by?: string | null
          defect_percent?: number | null
          format?: string | null
          id?: string
          is_conform?: boolean | null
          lighting_lux?: number | null
          lot_id?: string | null
          surface_tested?: number | null
          test_date?: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          code?: string
          controller_id?: string | null
          created_at?: string | null
          created_by?: string | null
          defect_percent?: number | null
          format?: string | null
          id?: string
          is_conform?: boolean | null
          lighting_lux?: number | null
          lot_id?: string | null
          surface_tested?: number | null
          test_date?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dimensional_surface_tests_controller_id_fkey"
            columns: ["controller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dimensional_surface_tests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dimensional_surface_tests_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "production_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_consumption: {
        Row: {
          consumption_kwh: number
          cost_amount: number | null
          created_at: string | null
          department: string | null
          equipment_name: string | null
          id: string
          recorded_date: string | null
          recorded_time: string | null
          source: Database["public"]["Enums"]["energy_source"]
        }
        Insert: {
          consumption_kwh: number
          cost_amount?: number | null
          created_at?: string | null
          department?: string | null
          equipment_name?: string | null
          id?: string
          recorded_date?: string | null
          recorded_time?: string | null
          source: Database["public"]["Enums"]["energy_source"]
        }
        Update: {
          consumption_kwh?: number
          cost_amount?: number | null
          created_at?: string | null
          department?: string | null
          equipment_name?: string | null
          id?: string
          recorded_date?: string | null
          recorded_time?: string | null
          source?: Database["public"]["Enums"]["energy_source"]
        }
        Relationships: []
      }
      equipment_calibration: {
        Row: {
          calibration_certificate: string | null
          created_at: string | null
          equipment_name: string
          equipment_type: string
          id: string
          is_active: boolean | null
          last_calibration_date: string
          next_calibration_date: string
          serial_number: string | null
          updated_at: string | null
        }
        Insert: {
          calibration_certificate?: string | null
          created_at?: string | null
          equipment_name: string
          equipment_type: string
          id?: string
          is_active?: boolean | null
          last_calibration_date: string
          next_calibration_date: string
          serial_number?: string | null
          updated_at?: string | null
        }
        Update: {
          calibration_certificate?: string | null
          created_at?: string | null
          equipment_name?: string
          equipment_type?: string
          id?: string
          is_active?: boolean | null
          last_calibration_date?: string
          next_calibration_date?: string
          serial_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      humidity_controls: {
        Row: {
          code: string
          controller_id: string | null
          created_at: string | null
          created_by: string | null
          fnc_no: string | null
          humidity: number
          id: string
          is_conform: boolean | null
          lot_id: string | null
          section: string | null
          silo_no: string | null
          spec_max: number
          spec_min: number
          test_date: string
          test_hour: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          code: string
          controller_id?: string | null
          created_at?: string | null
          created_by?: string | null
          fnc_no?: string | null
          humidity: number
          id?: string
          is_conform?: boolean | null
          lot_id?: string | null
          section?: string | null
          silo_no?: string | null
          spec_max: number
          spec_min: number
          test_date?: string
          test_hour?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          code?: string
          controller_id?: string | null
          created_at?: string | null
          created_by?: string | null
          fnc_no?: string | null
          humidity?: number
          id?: string
          is_conform?: boolean | null
          lot_id?: string | null
          section?: string | null
          silo_no?: string | null
          spec_max?: number
          spec_min?: number
          test_date?: string
          test_hour?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "humidity_controls_controller_id_fkey"
            columns: ["controller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "humidity_controls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "humidity_controls_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "production_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          module_id: string | null
          permission_key: string
          permission_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          module_id?: string | null
          permission_key: string
          permission_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          module_id?: string | null
          permission_key?: string
          permission_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "app_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      production_lots: {
        Row: {
          created_at: string | null
          id: string
          lot_number: string
          operator_id: string | null
          product_type: string
          production_date: string
          quantity: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lot_number: string
          operator_id?: string | null
          product_type: string
          production_date: string
          quantity: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lot_number?: string
          operator_id?: string | null
          product_type?: string
          production_date?: string
          quantity?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_lots_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quality_standards: {
        Row: {
          category: string
          created_at: string | null
          id: string
          is_active: boolean | null
          parameters: Json
          standard_code: string
          standard_name: string
          tolerance_values: Json
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parameters: Json
          standard_code: string
          standard_name: string
          tolerance_values: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parameters?: Json
          standard_code?: string
          standard_name?: string
          tolerance_values?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      quality_tests: {
        Row: {
          break_resistance_n: number | null
          created_at: string | null
          defect_count: number | null
          defect_type: Database["public"]["Enums"]["defect_type"] | null
          id: string
          length_mm: number | null
          lot_id: string
          notes: string | null
          operator_id: string | null
          status: Database["public"]["Enums"]["test_status"] | null
          test_date: string | null
          test_type: string | null
          thickness_mm: number | null
          updated_at: string | null
          water_absorption_percent: number | null
          width_mm: number | null
        }
        Insert: {
          break_resistance_n?: number | null
          created_at?: string | null
          defect_count?: number | null
          defect_type?: Database["public"]["Enums"]["defect_type"] | null
          id?: string
          length_mm?: number | null
          lot_id: string
          notes?: string | null
          operator_id?: string | null
          status?: Database["public"]["Enums"]["test_status"] | null
          test_date?: string | null
          test_type?: string | null
          thickness_mm?: number | null
          updated_at?: string | null
          water_absorption_percent?: number | null
          width_mm?: number | null
        }
        Update: {
          break_resistance_n?: number | null
          created_at?: string | null
          defect_count?: number | null
          defect_type?: Database["public"]["Enums"]["defect_type"] | null
          id?: string
          length_mm?: number | null
          lot_id?: string
          notes?: string | null
          operator_id?: string | null
          status?: Database["public"]["Enums"]["test_status"] | null
          test_date?: string | null
          test_type?: string | null
          thickness_mm?: number | null
          updated_at?: string | null
          water_absorption_percent?: number | null
          width_mm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quality_tests_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "production_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quality_tests_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resistance_test_samples: {
        Row: {
          created_at: string | null
          force: number
          id: string
          is_conform: boolean | null
          load_n: number
          modulus_of_rupture: number | null
          resistance_test_id: string
          rupture_resistance: number | null
          sample_no: number
          thickness: number
          width: number
        }
        Insert: {
          created_at?: string | null
          force: number
          id?: string
          is_conform?: boolean | null
          load_n: number
          modulus_of_rupture?: number | null
          resistance_test_id: string
          rupture_resistance?: number | null
          sample_no: number
          thickness: number
          width: number
        }
        Update: {
          created_at?: string | null
          force?: number
          id?: string
          is_conform?: boolean | null
          load_n?: number
          modulus_of_rupture?: number | null
          resistance_test_id?: string
          rupture_resistance?: number | null
          sample_no?: number
          thickness?: number
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "resistance_test_samples_resistance_test_id_fkey"
            columns: ["resistance_test_id"]
            isOneToOne: false
            referencedRelation: "resistance_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      resistance_tests: {
        Row: {
          code: string
          controller_id: string | null
          created_at: string | null
          created_by: string | null
          distance: number | null
          format: string | null
          id: string
          is_conform: boolean | null
          lot_id: string | null
          roller_diameter: number | null
          rubber_thickness: number | null
          span: number | null
          test_date: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          code: string
          controller_id?: string | null
          created_at?: string | null
          created_by?: string | null
          distance?: number | null
          format?: string | null
          id?: string
          is_conform?: boolean | null
          lot_id?: string | null
          roller_diameter?: number | null
          rubber_thickness?: number | null
          span?: number | null
          test_date?: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          code?: string
          controller_id?: string | null
          created_at?: string | null
          created_by?: string | null
          distance?: number | null
          format?: string | null
          id?: string
          is_conform?: boolean | null
          lot_id?: string | null
          roller_diameter?: number | null
          rubber_thickness?: number | null
          span?: number | null
          test_date?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resistance_tests_controller_id_fkey"
            columns: ["controller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resistance_tests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resistance_tests_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "production_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          granted: boolean | null
          id: string
          permission_id: string | null
          role_id: string | null
        }
        Insert: {
          created_at?: string | null
          granted?: boolean | null
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Update: {
          created_at?: string | null
          granted?: boolean | null
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles_with_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_system_role: boolean | null
          role_key: string
          role_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system_role?: boolean | null
          role_key: string
          role_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system_role?: boolean | null
          role_key?: string
          role_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      testing_campaigns: {
        Row: {
          campaign_name: string
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_name: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_name?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testing_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          module: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          module?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          module?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_by: string | null
          created_at: string | null
          id: string
          role_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles_with_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      waste_records: {
        Row: {
          cost_amount: number | null
          created_at: string | null
          disposal_method: string | null
          id: string
          notes: string | null
          quantity_kg: number
          recorded_date: string | null
          responsible_person_id: string | null
          waste_type: Database["public"]["Enums"]["waste_type"]
        }
        Insert: {
          cost_amount?: number | null
          created_at?: string | null
          disposal_method?: string | null
          id?: string
          notes?: string | null
          quantity_kg: number
          recorded_date?: string | null
          responsible_person_id?: string | null
          waste_type: Database["public"]["Enums"]["waste_type"]
        }
        Update: {
          cost_amount?: number | null
          created_at?: string | null
          disposal_method?: string | null
          id?: string
          notes?: string | null
          quantity_kg?: number
          recorded_date?: string | null
          responsible_person_id?: string | null
          waste_type?: Database["public"]["Enums"]["waste_type"]
        }
        Relationships: [
          {
            foreignKeyName: "waste_records_responsible_person_id_fkey"
            columns: ["responsible_person_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_permissions: {
        Row: {
          permissions: string[] | null
          role_key: string | null
          role_name: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_roles_with_permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          is_system_role: boolean | null
          permissions: Json | null
          role_key: string | null
          role_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_default_role: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      calculate_modulus_of_rupture: {
        Args: { force: number; width: number; thickness: number }
        Returns: number
      }
      check_dimensional_conformity: {
        Args: { measurements: number[]; tolerance: number }
        Returns: boolean
      }
      check_humidity_conformity: {
        Args: { humidity: number; spec_min: number; spec_max: number }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      defect_type:
        | "none"
        | "crack"
        | "glaze"
        | "dimension"
        | "color"
        | "warping"
      energy_source: "electricity" | "gas" | "solar" | "other"
      test_status: "Conforme" | "Non-conforme" | "En cours"
      user_role:
        | "admin"
        | "quality_technician"
        | "production_manager"
        | "operator"
      waste_type: "ceramic" | "glaze" | "packaging" | "chemical" | "water"
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
    Enums: {
      defect_type: ["none", "crack", "glaze", "dimension", "color", "warping"],
      energy_source: ["electricity", "gas", "solar", "other"],
      test_status: ["Conforme", "Non-conforme", "En cours"],
      user_role: [
        "admin",
        "quality_technician",
        "production_manager",
        "operator",
      ],
      waste_type: ["ceramic", "glaze", "packaging", "chemical", "water"],
    },
  },
} as const
