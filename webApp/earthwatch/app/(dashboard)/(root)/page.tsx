'use client';
import React, {useEffect, useState} from 'react';
import DataCard from './_components/Card';
import {DataTable} from './_components/data-table';
import {columns} from './_components/column';
import {getData} from '@/actions/get-data';
import supabase from '@/hooks/supabase';
const page = () => {
  const [fetchData, setFetchData] = useState<any>('');

  useEffect(() => {
    (async () => {
      const {data: initialData, error} = await supabase
        .from('dirtinfo')
        .select('*');

      const channels = supabase
        .channel('custom-all-channel')
        .on(
          'postgres_changes',
          {event: '*', schema: 'public', table: 'dirtinfo'},
          payload => {
            console.log('Change received!', payload);
            // Merge new data with existing data
            setFetchData((prevData: any) => [...prevData, payload.new]);
          },
        )
        .subscribe();

      // Set initial data
      setFetchData(initialData);
    })();
  }, []);
  return (
    <div className="md:w-full">
      <div className="mx-4 gap-y-3 flex flex-col md:flex-row items-center justify-center gap-x-10 md:w-full">
        <DataCard
          title="Total uploads"
          description="Total number of images and locations uploaded"
          content={fetchData.length}
        />
        {/* <DataCard
          title="Total unique areas"
          description="Total number of areas uploaded from"
          content="1000"
        /> */}
      </div>
      <div className=" mx-20 mt-4 mb-4 rounded-md">
        <DataTable columns={columns} data={fetchData!} />
      </div>
    </div>
  );
};

export default page;
