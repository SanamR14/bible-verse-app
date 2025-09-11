export interface Quiz {
  id: number;
  title: string;
  created_at: string;
}

export interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  options: string[];
  correct_answer: number;
}

export interface Player {
  id: number;
  name: string;
  session_code: string;
  score: number;
}

export interface Answer {
  id: number;
  player_id: number;
  question_id: number;
  selected_option: number;
  is_correct: boolean;
  answered_at: string;
}

export interface Mutual {
  id: number;
  name: string;
  avatar_url?: string;
}

export interface User {
  id: number;
    name: string;
  is_private: boolean;
  // avatar_url?: string;
  // headline?: string;
  // mutuals?: Mutual[];
}

