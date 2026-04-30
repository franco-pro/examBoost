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
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { data } = await apiClient.get('/users/list', {
        params: { page, limit: PAGE_SIZE },
      });
      if(data && data.users && Array.isArray(data.users) && data.total){
        // data.users should be an array of User objects
          if(data.users.length === 0){
            // No more users to load
            setHasMore(false);
            return;
          }
          setUsers(prev => [...prev, ...data.users]);
          setHasMore(page < data.totalPages); // plus de pages ?
          setPage(prev => prev + 1);
          console.log('total users ', data.total)
          setTotal(data.total);
      }
 
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);
  
  return { users, loading, total, hasMore, fetchUsers };
}