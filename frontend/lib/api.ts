import axios from 'axios';
import type { NextRequest } from "next/server"

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchMeEdge = async (request: NextRequest) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    })

    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.error("fetchMeEdge error:", err)
    return null
  }
}

export const register = async (email: string, password: string, fullName?: string) => {
  const response = await api.post('/auth/register', { email, password, fullName });
  return response.data;
}

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const fetchMe = async () => {
  const response = await api.get("/api/auth/me", {
    withCredentials: true, 
  });
  return response.data;
};

export const getStations = async () => {
  const response = await api.get('/stations');
  return response.data;
}

export const fetchSchedules = async (search?: string, sort?: string) => {
  const response = await api.get('/schedules', {
    params: { search, sort },
  });
  return response.data;
};

export const fetchSchedule = async (id: string) => {
  const response = await api.get(`/schedules/${id}`);
  return response.data;
};

export const fetchTrains = async () => {
  const response = await api.get('/trains');
  return response.data;
};

export const fetchTrain = async (id: string) => {
  const response = await api.get(`/trains/${id}`);
  return response.data;
};

export const createTrain = async (trainData: any) => {
  const response = await api.post('/trains', trainData);
  return response.data;
};

export const updateTrain = async (id: string, trainData: any) => {
  const response = await api.patch(`/trains/${id}`, trainData);
  return response.data;
};

export const deleteTrain = async (id: string) => {
  const response = await api.delete(`/trains/${id}`);
  return response.data;
};

export const fetchStations = async () => {
  const response = await api.get('/stations');
  return response.data;
};

export const fetchStation = async (id: string) => {
  const response = await api.get(`/stations/${id}`);
  return response.data;
};

export const createStation = async (stationData: any) => {
  const response = await api.post('/stations', stationData);
  return response.data;
};

export const updateStation = async (id: string, stationData: any) => {
  const response = await api.patch(`/stations/${id}`, stationData);
  return response.data;
};

export const deleteStation = async (id: string) => {
  const response = await api.delete(`/stations/${id}`);
  return response.data;
};

export const createSchedule = async (scheduleData: any) => {
  const response = await api.post('/schedules', scheduleData);
  return response.data;
};

export const updateSchedule = async (id: string, scheduleData: any) => {
  const response = await api.patch(`/schedules/${id}`, scheduleData);
  return response.data;
};

export const deleteSchedule = async (id: string) => {
  const response = await api.delete(`/schedules/${id}`);
  return response.data;
};

// Profile API
export const fetchProfiles = async () => {
  const response = await api.get('/profiles');
  return response.data;
};

export const fetchProfile = async (id: string) => {
  const response = await api.get(`/profiles/${id}`);
  return response.data;
};

export const createProfile = async (profileData: any) => {
  const response = await api.post('/profiles', profileData);
  return response.data;
};

export const updateProfile = async (id: string, profileData: any) => {
  const response = await api.patch(`/profiles/${id}`, profileData);
  return response.data;
};

export const deleteProfile = async (id: string) => {
  const response = await api.delete(`/profiles/${id}`);
  return response.data;
};

export default api;
