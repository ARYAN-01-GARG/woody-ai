"use client";

import { TooltipArrow, TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";


interface HintProps {
    children: React.ReactNode;
    text: string;
    side? : 'top' | 'right' | 'bottom' | 'left';
    align? : 'start' | 'center' | 'end';
}

/**
 * Displays a tooltip with customizable position and alignment when hovering or focusing on the wrapped element.
 *
 * @param children - The React node that triggers the tooltip when interacted with
 * @param text - The string content shown inside the tooltip
 * @param side - Optional; the side of the trigger where the tooltip appears (`'top'`, `'right'`, `'bottom'`, or `'left'`). Defaults to `'top'`.
 * @param align - Optional; alignment of the tooltip relative to the trigger (`'start'`, `'center'`, or `'end'`). Defaults to `'center'`.
 *
 * @returns A React element that wraps the children with tooltip functionality
 */
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