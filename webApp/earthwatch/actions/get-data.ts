'use client';
import supabase from '@/hooks/supabase';
import {useEffect, useState} from 'react';

export const getData = async () => {
  const [fetchData, setFetchData] = useState<any>('');
  useEffect(() => {
    (async () => {
      const {data: dirtinfo, error} = await supabase
        .from('dirtinfo')
        .select('*');

      setFetchData(dirtinfo);
    })();
  });
  return fetchData;
};
