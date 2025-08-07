"use client";

import { TooltipArrow, TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";


interface HintProps {
    children: React.ReactNode;
    text: string;
    side? : 'top' | 'right' | 'bottom' | 'left';
    align? : 'start' | 'center' | 'end';
}

function Hint({
    children,
    text,
    side = 'top',
    align = 'center'
    }: HintProps
) {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger className="inline-flex items-center" asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} align={align}>
                <p>{text}</p>
                <TooltipArrow />
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default Hint