'use client';

import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import { dataProvider } from '@/lib/supabaseDataProvider';

export default function AdminPanel() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="products"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="name"
        hasCreate={true}
        hasEdit={true}
      />
    </Admin>
  );
}