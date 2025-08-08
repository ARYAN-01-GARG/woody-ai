import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import './code-theme.css'

import { useEffect } from 'react';

export const CodeView = ({ code, language }: { code: string; language: string }) => {
    useEffect(() => {
        Prism.highlightAll();
    }, [code]);

    return (
        <pre className={`p-2 bg-transparent border-none rounded-none m-0 text-xs language-${language}`}>
            <code className={`language-${language}`}>
                {code}
            </code>
        </pre>
    );
    }

