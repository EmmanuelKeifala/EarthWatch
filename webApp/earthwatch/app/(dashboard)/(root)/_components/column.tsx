'use client';
import {ArrowUpDown, Eye, MoreHorizontal} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export const columns: any = [
  {
    accessorKey: 'location_name',
    id: 'location_name',
    header: ({column}: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'latitude',
    header: ({column}: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Latitude
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'longitude',
    header: ({column}: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Longitude
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: 'image',
    Header: 'Image',
    accessor: 'image_url',
    header: ({column}: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Image
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({row}: any) => {
      const {image_url} = row.original;
      console.log(image_url);
      // return <Image src={image_url} alt="Image" width={40} height={40} />;
      return (
        <a href={`${image_url}`} target={'_blank'}>
          click to view image
        </a>
      );
    },
  },
  {
    id: 'actions',
    cell: ({row}: any) => {
      const {latitude, longitude} = row.original;

      const handleOpenMap = () => {
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=1`;
        window.open(googleMapsUrl, '_blank');
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleOpenMap}>
              <Eye className="h-4 w-4 mr-2" />
              View on map
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
