"use client";

import { Button } from '@/components/ui/button';
import { Fragment } from '@/generated/prisma';
import { ExternalLinkIcon, RefreshCcwIcon } from 'lucide-react';
import React, { useState } from 'react'

interface Props{
    data: Fragment;
}

function FragmentWeb({ data } : Props) {
  const [fragmentKey , setFragmentKey] = useState(0);
  const [copied , setCopied] = useState(false);

  const handleRefresh = () => {
    setFragmentKey(prevKey => prevKey + 1);
}

  const handleCopy = () => {
    if (data.sandboxUrl) {
      navigator.clipboard.writeText(data.sandboxUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }
  };

  return (
    <div className="flex flex-col  w-full h-full">
      <div className='p-2 border-b bg-sidebar flex items-center gap-x-2'>
        <Button variant='outline' size={'sm'} onClick={handleRefresh}>
          <RefreshCcwIcon/>
        </Button>
        <Button
          variant='outline'
          size={'sm'}
          onClick={handleCopy}
          disabled={!data.sandboxUrl || copied}
          className='flex-1 justify-start text-center font-normal'
        >
          <span className='truncate'>{data.sandboxUrl}</span>
        </Button>
        <Button
          variant={'outline'}
          size={'sm'}
          onClick={() => {
            if (data.sandboxUrl) {
              window.open(data.sandboxUrl, '_blank');
            }
          }}
          disabled={!data.sandboxUrl}
        >
          <ExternalLinkIcon />
        </Button>
      </div>
      <iframe
        key={fragmentKey}
        className='h-full w-full'
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        loading='lazy'
        src={data.sandboxUrl}
      />
    </div>
  )
}

export default FragmentWeb