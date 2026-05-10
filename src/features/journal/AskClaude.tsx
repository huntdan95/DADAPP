import { useState } from 'react';
import { Loader2, MessageCircle, Send } from 'lucide-react';
import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { askPatterns, type PatternsHistoryTurn } from '@/lib/ai/patterns';
import { cn } from '@/lib/utils';
import { friendlyError } from '@/lib/errors';

const SUGGESTED_QUESTIONS = [
  'What fly has worked best for me this year?',
  'When do I catch the most browns?',
  'Have I caught anything during falling pressure?',
  'Best trolling depth I\'ve had for walleye?',
  'What time of day produces my biggest fish?',
];

/**
 * Pattern-insights chat. Each Q+A pair is appended to history so
 * follow-ups can build on prior turns. Cached server-side per session,
 * so multi-turn conversations stay cheap.
 */
export function AskClaude() {
  const [history, setHistory] = useState<PatternsHistoryTurn[]>([]);
  const [pending, setPending] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(question: string) {
    if (!question.trim() || loading) return;
    const newUser: PatternsHistoryTurn = { role: 'user', content: question };
    setHistory((h) => [...h, newUser]);
    setPending('');
    setLoading(true);
    setError(null);
    try {
      const res = await askPatterns({
        question,
        history,
      });
      setHistory((h) => [...h, { role: 'assistant', content: res.answer }]);
    } catch (e) {
      const msg = friendlyError(e);
      setError(msg);
      // Roll back the unanswered user turn so the chat stays consistent.
      setHistory((h) => h.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-info" />
          Ask about my fishing
        </CardTitle>
        <CardSubtitle>
          Natural-language Q&A over your logged catches. Powered by Claude.
        </CardSubtitle>
      </CardHeader>

      <div className="px-4 pb-4 flex flex-col gap-3">
        {history.length === 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="text-xs uppercase tracking-wider text-muted mb-1">
              Try one of these
            </div>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                disabled={loading}
                className="text-left text-sm px-3 py-2 rounded-lg bg-surface-2 border border-border hover:border-accent/40 hover:bg-surface-2/70 transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
            {history.map((turn, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-xl px-3 py-2 text-sm whitespace-pre-wrap',
                  turn.role === 'user'
                    ? 'bg-info/10 border border-info/30 self-end max-w-[85%]'
                    : 'bg-surface-2 border border-border self-start max-w-[90%]'
                )}
              >
                {turn.content}
              </div>
            ))}
            {loading && (
              <div className="self-start flex items-center gap-2 text-muted text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking…
              </div>
            )}
          </div>
        )}

        {error && <div className="text-sm text-danger">{error}</div>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(pending);
          }}
          className="flex gap-2 pt-1"
        >
          <input
            value={pending}
            onChange={(e) => setPending(e.target.value)}
            placeholder="Ask anything about your catches…"
            disabled={loading}
            className="flex-1 h-11 px-3 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent/60"
          />
          <Button type="submit" disabled={loading || pending.trim().length < 2} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
