"use client";

import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Fragment } from '@/generated/prisma';
import { ExternalLinkIcon, RefreshCcwIcon } from 'lucide-react';
import Hint from '@/components/ui/hint';

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
    <div className="flex flex-col w-full h-full">
      <div className='p-2 border-b bg-sidebar flex items-center gap-x-2 w-full'>
        <Hint text="Refresh" side='bottom' align='start'>
          <Button variant='outline' size={'sm'} onClick={handleRefresh}>
            <RefreshCcwIcon/>
          </Button>
        </Hint>
        <Hint text="Click to copy the sandbox URL" side='bottom'>
          <Button
            variant='outline'
            size={'sm'}
            onClick={handleCopy}
            disabled={!data.sandboxUrl || copied}
            className='flex-grow justify-start text-center font-normal'
          >
            <span className='truncate'>{data.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint text="Open in new tab" side='bottom' align='start'>
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
      </Hint>
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

export default FragmentWeb;