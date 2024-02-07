import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import {createClient} from '@supabase/supabase-js';

const ExpoSecureStoreAdapter = {
  getItem: key => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: key => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = 'https://fiwididpphjpwxrlkgrp.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpd2lkaWRwcGhqcHd4cmxrZ3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyODYyMzUsImV4cCI6MjAyMjg2MjIzNX0.GHGUIckPOvgqVtqUzWnRlJAkF_SjW_wN8jqWnZs3g5U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
