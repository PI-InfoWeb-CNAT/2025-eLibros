// Hook para dados administrativos
import { useState, useEffect } from 'react';
import { adminApi, AdminStats, AdminUserInfo, RecentActivity } from '../services/adminApi';

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => setLoading(true) };
}

export function useAdminUserInfo() {
  const [userInfo, setUserInfo] = useState<AdminUserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getUserInfo();
        setUserInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar informações do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userInfo, loading, error };
}

export function useRecentActivities() {
  const [activities, setActivities] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getRecentActivities();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar atividades recentes');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
}