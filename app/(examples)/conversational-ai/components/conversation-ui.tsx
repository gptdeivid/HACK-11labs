'use client';

import type { GetAgentResponseModel } from '@elevenlabs/elevenlabs-js/api';
import { useConversation } from '@elevenlabs/react';
import { Loader2, Mic, PhoneOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useConversationalAI } from '@/app/(examples)/conversational-ai/components/conversational-ai-provider';
import { getAgent, getConversationToken } from '@/app/actions/manage-agents';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function ConversationUI() {
  const { agents } = useConversationalAI();
  const searchParams = useSearchParams();
  const agentIdFromUrl = searchParams.get('agent_id');

  const [selectedAgent, setSelectedAgent] = useState<string | null>(
    agentIdFromUrl || (agents.length > 0 ? agents[0].agentId : null)
  );

  const [agentDetails, setAgentDetails] = useState<GetAgentResponseModel | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { message: string; sender: string; timestamp: string }[]
  >([]);

  const conversation = useConversation({
    onConnect: () => toast.info('Connected to agent'),
    onDisconnect: () => {
      toast.info('Disconnected from agent');
      // auto-save history on disconnect
      try {
        if (messages.length > 0) {
          saveHistoryToFile();
        }
      } catch (e) {
        console.error('Failed to auto-save conversation history:', e);
      }
    },
    onMessage: (message) => {
      // store message in local state for history export
      try {
        const sender =
          // @ts-ignore possible shape differences
          message.sender || message.senderId || message.author || 'agent';
        setMessages((prev) => [
          ...prev,
          { message: message.message ?? '', sender, timestamp: new Date().toISOString() },
        ]);
      } catch (e) {
        console.error('Failed to record message:', e);
      }

      toast.info(`Message: ${message.message}`);
    },
    onError: (error) => toast.error(`Error: ${error}`),
  });

  useEffect(() => {
    if (agentIdFromUrl) {
      setSelectedAgent(agentIdFromUrl);
    }
  }, [agentIdFromUrl]);

  useEffect(() => {
    let isMounted = true;

    if (selectedAgent) {
      setIsLoadingDetails(true);
      setLoadError(null);

      getAgent(selectedAgent)
        .then((result) => {
          if (!isMounted) return;

          if (result.ok) {
            setAgentDetails(result.value);
            setLoadError(null);
          } else {
            console.error('Failed to load agent details:', result.error);
            setLoadError(result.error || 'Failed to load agent details');
          }
        })
        .catch((error) => {
          if (!isMounted) return;
          setLoadError('An unexpected error occurred');
          console.error('Error loading agent:', error);
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingDetails(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [selectedAgent]);

  const startConversation = useCallback(async () => {
    if (!selectedAgent) return;

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const conversationTokenResult = await getConversationToken(selectedAgent);

      if (!conversationTokenResult.ok) {
        console.error('Failed to get conversation token:', conversationTokenResult.error);
        return;
      }

      await conversation.startSession({
        connectionType: 'webrtc',
        conversationToken: conversationTokenResult.value.token,
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation, selectedAgent]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  // Save conversation history to a .txt file and trigger download
  function saveHistoryToFile() {
    if (messages.length === 0) return;

    const lines = messages.map((m) => `${m.timestamp} - ${m.sender}: ${m.message}`);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = agentDetails?.name ? agentDetails.name.replace(/\s+/g, '_') : 'agent';
    a.href = url;
    a.download = `conversation-${safeName}-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (isLoadingDetails) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Loading agent...</p>
      </div>
    );
  }

  if (loadError && !agentDetails) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTitle>Error loading agent</AlertTitle>
        <AlertDescription>{loadError}</AlertDescription>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => {
            setIsLoadingDetails(true);
            setLoadError(null);
            getAgent(selectedAgent as string).then((result) => {
              if (result.ok) {
                setAgentDetails(result.value);
              } else {
                setLoadError(result.error || 'Failed to load agent details');
              }
              setIsLoadingDetails(false);
            });
          }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  if (!agentDetails) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <p className="text-muted-foreground">No agent details available</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold">¿Quieres platicar con {agentDetails.name}?</h3>
        <p className="text-muted-foreground">
          Presiona el botón para iniciar la conversación y conectar en vivo con tu agente.
        </p>
      </div>

      <Button
        onClick={conversation.status === 'connected' ? stopConversation : startConversation}
        disabled={conversation.status === 'connecting'}
        variant={conversation.status === 'connected' ? 'secondary' : 'default'}
        className="flex items-center justify-center"
      >
        {conversation.status === 'connecting' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Conectando...
          </>
        ) : conversation.status === 'connected' ? (
          <>
            <PhoneOff className="mr-2 h-4 w-4" />
            Terminar plática
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            Platicar con agente
          </>
        )}
      </Button>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => saveHistoryToFile()}
          disabled={messages.length === 0}
          className="flex items-center justify-center"
        >
          Guardar historial (.txt)
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Estado: <span className="capitalize">{conversation.status}</span>
      </p>
    </div>
  );
}
