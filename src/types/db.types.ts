export type Database = {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          user_id: string;
          text: string;
          completed: boolean;
          priority: 'low' | 'medium' | 'high';
          category: string | null;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          text: string;
          completed?: boolean;
          priority: 'low' | 'medium' | 'high';
          category?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          text?: string;
          completed?: boolean;
          priority?: 'low' | 'medium' | 'high';
          category?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
      };
    };
  };
};