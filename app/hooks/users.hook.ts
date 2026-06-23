// hooks/useUsers.ts
import { useState, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { authService } from '../api/authService';
import { User } from '../features/user/types';

const PAGE_SIZE = 20;

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [TmpParam, setTmpParam] = useState<{users: User[], page: number, total: number, hasMore: boolean}>({
    users: [],
    page: 1,
    total: 0,
    hasMore: true
  });


  const removeUser = useCallback((userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    console.log('executing updateUser with', updatedUser);
    console.log('update date before', users);

    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    console.log('update date after', users);
  }, []);

  const fetchUsers = useCallback(async () => {
    if (loading || !hasMore) return;
    if(TmpParam.users.length > 0){
      // if we have a temporary users list (from search), we use it instead of fetching from the API
      setUsers(TmpParam.users);
      setPage(TmpParam.page);
      setTotal(TmpParam.total);
      setHasMore(TmpParam.hasMore);
      
      //renit tmpParam
      setTmpParam({
        users: [],
        page: 1,
        total: 0,
        hasMore: true
      })
      return;
    }

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
          setHasMore(page < data.totalPages); 
          setPage(prev => prev + 1);
          setTotal(data.total);
          
      }
 
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  const searchUsers = useCallback(async (query: string) => {
    if (loading || !hasMore) return;

    setTmpParam({
      users: users,
      page: page,
      total: total,
      hasMore: hasMore
    });

    setLoading(true);
    try {
      const { data } = await authService.search({query, page: 1, limit: PAGE_SIZE});
      if(data && data.users && Array.isArray(data.users) && data.total){
        // data.users should be an array of User objects
          if(data.users.length === 0){
            // No more users to load
            setHasMore(false);
            return;
          }
          setUsers(prev => [...prev, ...data.users]);
          setHasMore(page < data.totalPages); 
          setPage(prev => prev + 1);
          setTotal(data.total);
      }
  }catch(error : any){
    console.log("une erreur est survenue", error);
  }
    finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);
  
  return { users, loading, total, hasMore, fetchUsers, searchUsers, removeUser, updateUser};
}