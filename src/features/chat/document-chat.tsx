'use client';

import {
  toUIMessages,
  useThreadMessages,
} from '@convex-dev/agent/react';
import { useMutation } from 'convex/react';
import { useEffect, useRef, useState } from 'react';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import { Response } from '@/components/ai-elements/response';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';

import { ChatWelcome } from './chat-welcome';
// import { PromptCounter } from '@/components/prompt-counter';

export interface DocumentChatProps {
  documentId: Id<'documents'>;
  document: Doc<'documents'> | undefined;
}

export default function DocumentChat(props: DocumentChatProps) {
  const { documentId, document } = props;
  const ensureReady = useMutation(api.documents.ensureDocumentChatReady);
  const ensuredRef = useRef(false);

  useEffect(() => {
    ensuredRef.current = false;
  }, [documentId]);

  useEffect(() => {
    if (!document || document.agentThreadId != null || ensuredRef.current) {
      return;
    }
    ensuredRef.current = true;
    void ensureReady({ documentId });
  }, [document, documentId, ensureReady]);

  const threadId = document?.agentThreadId;
  
  // Turn OFF streaming to avoid the error
  const { results: messagesResult } = useThreadMessages(
    api.chats.listMessages,
    threadId != null ? { threadId } : 'skip',
    { initialNumItems: 50, stream: false }, // Changed from true to false
  );

  const [prompt, setPrompt] = useState('');

  const sendMessage = useMutation(api.chats.sendMessage);

  const isReady = threadId != null;

  function handleSubmitMessage(
    message: PromptInputMessage,
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (!threadId || !document) return;
    void sendMessage({
      threadId,
      documentId: document._id,
      prompt: message.text,
    }).catch(() => setPrompt(message.text));
    setPrompt('');
  }

  // Safe message conversion with error handling
  let uiMessages: any[] = [];
  
  try {
    if (messagesResult) {
      const result = messagesResult as any;
      let messages: any[] = [];
      
      if (Array.isArray(result)) {
        messages = result;
      } else if (result.page && Array.isArray(result.page)) {
        messages = result.page;
      } else if (result.results && Array.isArray(result.results)) {
        messages = result.results;
      }
      
      if (messages.length > 0) {
        uiMessages = toUIMessages(messages);
      }
    }
  } catch (error) {
    console.error('Error converting messages:', error);
    // Fallback: just show empty state
    uiMessages = [];
  }
  
  const hasMessages = uiMessages.length > 0;

  if (!document) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-white dark:bg-stone-900">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Loading document…
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col divide-y bg-white dark:divide-stone-800 dark:bg-stone-900">
      <Conversation>
        <ConversationContent>
          {hasMessages ? (
            uiMessages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  <Response>{message.text}</Response>
                </MessageContent>
              </Message>
            ))
          ) : (
            <ChatWelcome documentName={document.name} />
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="p-4">
        <PromptInput onSubmit={handleSubmitMessage} className="relative">
          <PromptInputTextarea
            placeholder={
              isReady
                ? 'Enter your question (max 1,000 characters)'
                : 'Setting up chat…'
            }
            maxLength={1000}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          {/* <PromptCounter /> */}
          <PromptInputSubmit
            className="absolute right-2 bottom-2"
            disabled={!isReady || !prompt}
            status={'ready'}
          />
        </PromptInput>
      </div>
    </div>
  );
}