// hooks/useUsers.ts
import { useState, useCallback } from 'react';
import User from './entities/user';
import apiClient from '../api/apiClient';

const PAGE_SIZE = 20;

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { data } = await apiClient.get('/users/list', {
        params: { page, limit: PAGE_SIZE },
      });

      setUsers(prev => [...prev, ...data.users]);
      setHasMore(page < data.totalPages); // plus de pages ?
      setPage(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  return { users, loading, hasMore, fetchUsers };
}