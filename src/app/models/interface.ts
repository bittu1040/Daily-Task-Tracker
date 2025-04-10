export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
}

export interface refreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}


export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  date: string;
}


export interface Task {
  _id: string; // Matches MongoDB's `_id`
  title: string;
  done: boolean; // Indicates if the task is marked as done
  createdAt: Date;
  user: string; // User ID associated with the task
}

export interface TaskStatistics {
  total: number;
  done: number;
  pending: number;
}
