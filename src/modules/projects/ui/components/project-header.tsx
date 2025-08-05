import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ChevronDownIcon, ChevronLeftIcon, SunMoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';



interface Props{
    projectId : string;
}

export default function ProjectHeader({ projectId }: Props) {
    const trpc = useTRPC();
    const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({ id: projectId }));

    const { setTheme, theme } = useTheme();

    return (
        <header className='p-2 flex justify-between items-center border-b'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        size={"sm"}
                        className='focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!'
                    >
                        <Image
                            src={'/logo.svg'}
                            alt={'woody'}
                            width={32}
                            height={32}
                        />
                        <span className='text-sm font-medium'>{project.name}</span>
                        <ChevronDownIcon className='ml-2 h-4 w-4' />
                    </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' align='start'>
                    <DropdownMenuItem asChild>
                        <Link href='/'>
                            <ChevronLeftIcon />
                            <span>Go to Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className='gap-2'>
                            <SunMoonIcon className='size-4 text-muted-foreground' />
                            <span>Appearance</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                    <DropdownMenuRadioItem value='light'><span>Light</span></DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value='dark'><span>Dark</span></DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value='system'><span>System</span></DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                </DropdownMenuContent>

            </DropdownMenu>
        </header>
    );
}