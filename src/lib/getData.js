import {supabase} from './supabase';

const getData = async setFetchData => {
  try {
    // Fetch initial data
    const {data: initialData, error} = await supabase
      .from('dirtinfo')
      .select('*');

    // Subscribe to changes
    const channels = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'dirtinfo'},
        payload => {
          setFetchData(prevData => [...prevData, payload.new]);
        },
      )
      .subscribe();

    return initialData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export default getData;
