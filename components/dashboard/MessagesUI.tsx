"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Conversation = {
  key: string;
  dealId: string;
  dealTitle: string;
  dealCity: string;
  otherId: string;
  otherName: string;
  lastMessage: string;
  lastAt: string;
  unreadCount: number;
};

type ThreadMessage = {
  id: string;
  sender_id: string;
  senderName?: string;
  body: string;
  created_at: string;
};

interface Props {
  userId: string;
  role: "sourcer" | "investor" | "admin";
  initialDealId?: string;
  initialWithId?: string;
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function MessagesUI({ userId, role, initialDealId, initialWithId }: Props) {
  const supabase = createClient();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation | null>(null);
  const [thread, setThread] = useState<ThreadMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAdmin = role === "admin";

  const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;

  function containsPhone(text: string): boolean {
    // Strip all common formatting chars then check for 10+ consecutive digits
    // Catches: 07539 960669, 0 7 5 3 9 9 6 0 6 6 9, 07-539-960-669, etc.
    const stripped = text.replace(/[\s\-+().]/g, "");
    return /\d{10,}/.test(stripped);
  }

  const loadConversations = useCallback(async () => {
    type MsgRow = {
      id: string; deal_id: string; sender_id: string; recipient_id: string;
      body: string; read_at: string | null; created_at: string;
      deals: { id: string; title: string; city: string } | null;
      sender: { id: string; full_name: string | null } | null;
      recipient: { id: string; full_name: string | null } | null;
    };

    const sel = `id, deal_id, sender_id, recipient_id, body, read_at, created_at,
      deals(id, title, city),
      sender:profiles!messages_sender_id_fkey(id, full_name),
      recipient:profiles!messages_recipient_id_fkey(id, full_name)`;

    const { data } = isAdmin
      ? await supabase.from("messages").select(sel).order("created_at", { ascending: false })
      : await supabase.from("messages").select(sel)
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
          .order("created_at", { ascending: false });

    if (!data) { setLoading(false); return []; }
    const rows = data as unknown as MsgRow[];

    const map = new Map<string, Conversation>();
    for (const msg of rows) {
      const isMe = msg.sender_id === userId;
      const otherId = isAdmin
        ? msg.recipient_id
        : isMe ? msg.recipient_id : msg.sender_id;
      const otherProfile = isAdmin
        ? msg.recipient
        : isMe ? msg.recipient : msg.sender;
      const convKey = isAdmin
        ? `${msg.deal_id}:${[msg.sender_id, msg.recipient_id].sort().join(":")}`
        : `${msg.deal_id}:${otherId}`;

      if (!map.has(convKey)) {
        map.set(convKey, {
          key: convKey,
          dealId: msg.deal_id,
          dealTitle: msg.deals?.title ?? "Deal",
          dealCity: msg.deals?.city ?? "",
          otherId,
          otherName: isAdmin
            ? `${msg.sender?.full_name ?? "?"} ↔ ${msg.recipient?.full_name ?? "?"}`
            : otherProfile?.full_name ?? "User",
          lastMessage: msg.body,
          lastAt: msg.created_at,
          unreadCount: 0,
        });
      }
      if (!isAdmin && msg.recipient_id === userId && !msg.read_at) {
        map.get(convKey)!.unreadCount++;
      }
    }

    const convs = Array.from(map.values());
    setConversations(convs);
    setLoading(false);
    return convs;
  }, [userId, isAdmin]);

  const loadThread = useCallback(async (conv: Conversation) => {
    setThreadLoading(true);
    type ThreadRow = {
      id: string; sender_id: string; body: string; created_at: string;
      sender: { full_name: string | null } | null;
    };
    const { data } = await supabase
      .from("messages")
      .select(`id, sender_id, body, created_at, sender:profiles!messages_sender_id_fkey(full_name)`)
      .eq("deal_id", conv.dealId)
      .order("created_at", { ascending: true });

    const rows = (data ?? []) as unknown as ThreadRow[];
    const filtered = isAdmin
      ? rows
      : rows.filter((m) => m.sender_id === userId || m.sender_id === conv.otherId);

    setThread(
      filtered.map((m) => ({
        id: m.id,
        sender_id: m.sender_id,
        senderName: (m.sender as { full_name?: string } | null)?.full_name ?? "User",
        body: m.body,
        created_at: m.created_at,
      }))
    );
    setThreadLoading(false);
  }, [userId, isAdmin]);

  useEffect(() => {
    loadConversations().then(async (convs) => {
      if (initialDealId && initialWithId && convs.length >= 0) {
        const convKey = `${initialDealId}:${initialWithId}`;
        const existing = convs.find((c) => c.key === convKey);
        if (existing) {
          setActive(existing);
          loadThread(existing);
        } else {
          const [{ data: deal }, { data: other }] = await Promise.all([
            supabase.from("deals").select("id, title, city").eq("id", initialDealId).single(),
            supabase.from("profiles").select("id, full_name").eq("id", initialWithId).single(),
          ]);
          if (deal && other) {
            const newConv: Conversation = {
              key: convKey,
              dealId: deal.id,
              dealTitle: deal.title ?? "Deal",
              dealCity: deal.city ?? "",
              otherId: other.id,
              otherName: other.full_name ?? "User",
              lastMessage: "",
              lastAt: new Date().toISOString(),
              unreadCount: 0,
            };
            setConversations((prev) => [newConv, ...prev]);
            setActive(newConv);
            setThread([]);
          }
        }
      }
    });

    if (!isAdmin) {
      const channel = supabase
        .channel("inbox")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `recipient_id=eq.${userId}` },
          () => {
            loadConversations();
            setActive((prev) => { if (prev) loadThread(prev); return prev; });
          }
        )
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [userId, initialDealId, initialWithId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  async function selectConversation(conv: Conversation) {
    setActive(conv);
    await loadThread(conv);
    if (!isAdmin) {
      supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("deal_id", conv.dealId)
        .eq("recipient_id", userId)
        .is("read_at", null)
        .then(() => {
          setConversations((prev) =>
            prev.map((c) => (c.key === conv.key ? { ...c, unreadCount: 0 } : c))
          );
        });
    }
  }

  async function send() {
    if (!text.trim() || !active || sending || isAdmin) return;

    const body = text.trim();
    setSendError(null);

    if (EMAIL_RE.test(body)) {
      setSendError("Messages cannot contain email addresses. Please keep all communication on PropertyScan.");
      return;
    }
    if (containsPhone(body)) {
      setSendError("Messages cannot contain phone numbers. Please keep all communication on PropertyScan.");
      return;
    }

    setSending(true);
    setText("");

    const optimistic: ThreadMessage = {
      id: crypto.randomUUID(),
      sender_id: userId,
      body,
      created_at: new Date().toISOString(),
    };
    setThread((prev) => [...prev, optimistic]);
    setConversations((prev) =>
      prev.map((c) =>
        c.key === active.key ? { ...c, lastMessage: body, lastAt: optimistic.created_at } : c
      )
    );

    await supabase.from("messages").insert({
      deal_id: active.dealId,
      sender_id: userId,
      recipient_id: active.otherId,
      body,
      read_at: null,
    });

    setSending(false);
  }

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  return (
    <div className="flex h-full -m-6 lg:-m-8 overflow-hidden">
      {/* Left: Conversation list */}
      <div
        className={`w-72 xl:w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col ${
          active ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-navy">Messages</h1>
            {totalUnread > 0 && (
              <span className="text-xs font-bold bg-teal text-navy px-1.5 py-0.5 rounded-full leading-none">
                {totalUnread}
              </span>
            )}
          </div>
          {isAdmin && <p className="text-xs text-navy/40 mt-0.5">All platform conversations</p>}
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-24">
              <div className="w-5 h-5 border-2 border-teal border-t-transparent rounded-full animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-navy/40 mb-2">No messages yet</p>
              {role === "investor" && (
                <a href="/deals" className="text-xs text-teal hover:underline">
                  Browse deals to contact a sourcer →
                </a>
              )}
              {role === "sourcer" && (
                <p className="text-xs text-navy/30 leading-relaxed">
                  Investors will message you here about your listed deals.
                </p>
              )}
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.key}
                onClick={() => selectConversation(conv)}
                className={`w-full text-left px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                  active?.key === conv.key ? "bg-teal/5 border-l-2 border-l-teal" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center shrink-0 text-xs font-bold text-navy/50">
                  {initials(conv.otherName.split(" ↔ ")[0])}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className="text-sm font-semibold text-navy truncate">{conv.otherName}</p>
                    <span className="text-[10px] text-navy/30 shrink-0">{formatTime(conv.lastAt)}</span>
                  </div>
                  <p className="text-xs text-teal font-medium truncate mb-0.5">{conv.dealTitle}</p>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs text-navy/40 truncate">{conv.lastMessage || "No messages yet"}</p>
                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 bg-teal rounded-full flex items-center justify-center text-[10px] font-bold text-navy shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right: Thread */}
      <div className={`flex-1 flex flex-col min-w-0 ${active ? "flex" : "hidden lg:flex"}`}>
        {!active ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-12 h-12 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-navy/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm text-navy/40">Select a conversation</p>
            </div>
          </div>
        ) : (
          <>
            {/* Thread header */}
            <div className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActive(null)}
                className="lg:hidden text-navy/40 hover:text-navy transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-xs font-bold text-navy/50 shrink-0">
                {initials(active.otherName.split(" ↔ ")[0])}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-navy truncate">{active.otherName}</p>
                <p className="text-xs text-teal truncate">
                  {active.dealTitle}{active.dealCity ? ` · ${active.dealCity}` : ""}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3 bg-gray-50">
              {threadLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-5 h-5 border-2 border-teal border-t-transparent rounded-full animate-spin" />
                </div>
              ) : thread.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-navy/30">No messages yet — say hello!</p>
                </div>
              ) : (
                thread.map((msg) => {
                  const mine = msg.sender_id === userId && !isAdmin;
                  return (
                    <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                          mine
                            ? "bg-navy text-white rounded-br-sm"
                            : "bg-white text-navy border border-gray-200 rounded-bl-sm"
                        }`}
                      >
                        {(isAdmin || !mine) && msg.senderName && (
                          <p className={`text-[10px] font-semibold mb-1 ${mine ? "text-white/60" : "text-teal"}`}>
                            {msg.senderName}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                        <p className={`text-[10px] mt-1 ${mine ? "text-white/40" : "text-navy/30"}`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input (not shown for admin) */}
            {!isAdmin && (
              <div className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
                <div className="flex items-end gap-3">
                  <textarea
                    value={text}
                    onChange={(e) => { setText(e.target.value); setSendError(null); }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="Type a message…"
                    rows={1}
                    className="flex-1 resize-none px-4 py-2.5 border border-gray-200 rounded-xl text-navy text-sm placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors"
                    style={{ maxHeight: "8rem", overflowY: "auto" }}
                  />
                  <button
                    onClick={send}
                    disabled={!text.trim() || sending}
                    className="w-10 h-10 bg-teal text-navy rounded-xl flex items-center justify-center hover:bg-teal-400 transition-colors disabled:opacity-40 shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
                {sendError ? (
                  <p className="text-xs text-red-600 mt-1.5 ml-1 leading-snug">{sendError}</p>
                ) : (
                  <p className="text-[10px] text-navy/20 mt-1.5 ml-1 hidden sm:block">⌘ Enter to send</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
