// src/components/ChatBubble.tsx
import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {materialDark, vscDarkPlus, twilight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
}

const CodeBlock = ({code}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [copied]);

  const handleCopy = () => {
    setCopied(true);
  };

  return (
    <div >
      <CopyToClipboard text={code} onCopy={handleCopy}>
        <button className = "copy-button">{copied ? '📋Copied!' : '📋Copy Code'}</button>
      </CopyToClipboard>
      <SyntaxHighlighter style={vscDarkPlus} language="python">
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
